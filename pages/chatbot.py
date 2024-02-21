import streamlit as st
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
import pandas as pd

import settings

OPENAI_KEY = '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'

# App title
st.set_page_config(page_title="Chatbot", initial_sidebar_state="collapsed") 
col1, col2, col3 = st.columns(3)
col2.title('cognate.ai')

st.markdown(
    """
<style>
    [data-testid="collapsedControl"] {
        display: none
    }
</style>
""",
    unsafe_allow_html=True,
)

# hide footer
hide_streamlit_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            </style>
            """
st.markdown(hide_streamlit_style, unsafe_allow_html=True)




# Hugging Face Credentials
with st.sidebar:
    st.title('🤗💬 HugChat')
    if ('EMAIL' in st.secrets) and ('PASS' in st.secrets):
        st.success('HuggingFace Login credentials already provided!', icon='✅')
        hf_email = st.secrets['EMAIL']
        hf_pass = st.secrets['PASS']
    else:
        hf_email = st.text_input('Enter E-mail:', type='password')
        hf_pass = st.text_input('Enter password:', type='password')
        if not (hf_email and hf_pass):
            st.warning('Please enter your credentials!', icon='⚠️')
        else:
            st.success('Proceed to entering your prompt message!', icon='👉')
    st.markdown('📖 Learn how to build this app in this [blog](https://blog.streamlit.io/how-to-build-an-llm-powered-chatbot-with-streamlit/)!')
    
# Store LLM generated responses
if "messages" not in st.session_state.keys():
    st.session_state.messages = [{"role": "assistant", "content": "Feel free to ask me questions about your patient. I can also support by providing other anonymous patient information if you want to investigate other similar medical cases."}]

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])

# Function for generating LLM response
full_data = settings.full_data
curr_data = settings.curr_data
store = settings.store


# REPEAT!!
# data_subset = full_data[1:500]
# embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_KEY)
# store = Chroma.from_documents(
#     data_subset,
#     embeddings,
#     ids=[f"{item.metadata['source']}-{index}" for index, item in enumerate(data_subset)],
#     collection_name="Patient-Embeddings",
#     persist_directory="db"
# )
# store.persist()
# print(curr_data[0].page_content)
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
qa_with_source = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=store.as_retriever(),
    chain_type_kwargs={"prompt": PROMPT,},
    return_source_documents=True,
)
# def generate_response(prompt_input):
#     output = qa_with_source(prompt_input)
#     res = output['result']
#     sd = output['source_documents']
#     sd_pretty = [sd[i].page_content for i in range(len(sd))]
#     sd_print = '\n\n'.join(map(str, sd_pretty))
#     return f'{res}\n\nSimilar Patients to Investigate:\n\n{sd_print}'

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

    return f'{res}\n\nSimilar Patients to Investigate:\n\n{sd_print}', res, list_of_dfs

# User-provided prompt
if prompt := st.chat_input(disabled=not (hf_email and hf_pass)):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

# Generate a new response if last message is not from assistant
if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Looking through database"):
            # response = generate_response(prompt) 
            # # response = 'default response'
            # st.write(response) 

            response, res_print, res_dfs = generate_response(prompt)
            st.write(res_print)
            with st.expander("Similar Patients:"):
                # st.write("This content is hidden in a collapsible section")
                # st.write("It will be expanded when clicked on")

                for i in range(len(res_dfs)):
                    st.dataframe(res_dfs[i], column_config={"1": st.column_config.Column(width="large")})

    message = {"role": "assistant", "content": response}
    st.session_state.messages.append(message)

