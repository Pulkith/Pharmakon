#!/usr/bin/python3.12
from flask import Flask
from transformers import Wav2Vec2Tokenizer, Wav2Vec2ForCTC, AutoTokenizer, AutoModelForSeq2SeqLM
import librosa as lb
import torch
import pandas as pd
from flask import request
from flask_cors import CORS, cross_origin
import os

tokenizer = Wav2Vec2Tokenizer.from_pretrained('facebook/wav2vec2-base-960h')
model = Wav2Vec2ForCTC.from_pretrained('facebook/wav2vec2-base-960h')
app = Flask(__name__)
a = None
CORS(app, support_credentials=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

def send_transcript(file):
  waveform, rate = lb.load(file, sr = 16000)

  input_values = tokenizer(waveform, return_tensors='pt').input_values
  logits = model(input_values).logits

  predicted_ids = torch.argmax(logits, dim=-1)
  transcription = tokenizer.batch_decode(predicted_ids)
  return transcription

@app.route('/upload-voice', methods=['POST'])
def get_transcript(path: str):
    a = send_transcript(path)
    print(a)

@app.route('/get-transcript', methods=['GET'])
def return_transcript(file):
    return a

def translate_text(text, target_language):
    model_name = f'Helsinki-NLP/opus-mt-en-{target_language}'
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    translated_text = model.generate(**tokenizer(text, return_tensors="pt"), max_length=128)[0]
    translated_text = tokenizer.decode(translated_text, skip_special_tokens=True)

    return translated_text

def get_language_id(language):
    df = pd.read_csv('./data_pipeline/language_ids.csv')
    row = df[df['Language'] == language]
    if not row.empty:
        return row.iloc[0]['ID']
    return None

path_audio = "./data_pipeline/input_audio_data.csv"
path_big_data = "./data_pipeline/data.csv"

from langchain.document_loaders.csv_loader import CSVLoader
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI


def get_genresponse(curr_patient_path, ehr_path):

  curr_loader = CSVLoader(file_path=curr_patient_path, encoding="utf-8", csv_args={
                  'delimiter': ','})
  curr_data = curr_loader.load()
  open_api_key = OPENAI_KEY
  embeddings = OpenAIEmbeddings()
  loader = CSVLoader(file_path=ehr_path)
  data = loader.load()
  data_subset = data[:500]


  template = f"""You are a clinical decision support system that answers questions about medical patients.
    The following document shows the current patients data: {curr_data[0].page_content}
    If you don't know the answer, simply state that you don't know.""" + \
    """
    Here is relevant data from other patients:
    {context}

    Question: {question}"""

  PROMPT = PromptTemplate(
      template=template, input_variables=['context', 'question']
  )
  
  llm = ChatOpenAI(temperature=0, model='gpt-4', openai_api_key=OPENAI_KEY)

  store = Chroma.from_documents(
      data_subset,
      embeddings,
      ids=[f"{item.metadata['source']}-{index}" for index, item in enumerate(data_subset)],
      collection_name="Microbiology-Embeddings",
      persist_directory="db"
  )
  store.persist()

  qa_with_source = RetrievalQA.from_chain_type(
      llm=llm,
      chain_type="stuff",
      retriever=store.as_retriever(),
      chain_type_kwargs={"prompt": PROMPT,},
      return_source_documents=True,
  )



  def generate_response(prompt_input):
      output = qa_with_source(prompt_input)
      res = output['result']
      sd = output['source_documents']
      sd_pretty = [sd[i].page_content for i in range(len(sd))]
      sd_print = '\n\n'.join(map(str, sd_pretty))

      list_of_dfs = []
      for i in range(len(sd)):
          rows = sd[i].page_content.strip().split('\n')
          df = pd.DataFrame([x.split(': ', 1) for x in rows])
          list_of_dfs.append(df)

      return res, sd_print

  return generate_response
ans = None 
sim_patients = None
@app.route('/receive-chatbot', methods=['POST'])
def chatbot():
    query = request.json['query']
    bot = get_genresponse(path_audio, path_big_data)
    ans, sim_patients = bot(query)
    print("???")
    return {"answer": ans, "similar_patients": sim_patients}

@app.route('/translate', methods=['POST'])
def transler():
    query = request.json['text']
    response = translate_text(query, "es")
    return {"response": response }

@app.route('/get-chatbot-response', methods=['GET'])
@cross_origin(supports_credentials=True)
def return_chatbot():
    return {"answer": ans, "similar_patients": sim_patients}