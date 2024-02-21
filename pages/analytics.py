import streamlit as st
from streamlit_extras.switch_page_button import switch_page
import pandas as pd 
import altair as alt
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
import numpy as np
from scipy.spatial.distance import cdist


import settings

OPENAI_KEY = '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'

# hide footer
hide_streamlit_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            </style>
            """
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)
col2.title('cognate.ai')

st.title('Data Explorer')

curr_data = settings.curr_data

rows = curr_data[0].page_content.strip().split('\n')
df = pd.DataFrame([x.split(': ', 1) for x in rows])
# df.columns = ['Field', 'Value']

st.header('Current Patient')
# st.write(df)
st.dataframe(df, column_config={"1": st.column_config.Column(width="large")})
# print(curr_data[0].page_content)
# st.write(str(curr_data[0].page_content))


# Load data
data = pd.read_csv('./partial_microbiologyevents.csv') 

# Display statistics
col1, col2 = st.columns(2)

with col1:
    st.header('Statistics')
    st.write(data.describe())
#    st.write(data.head())

with col2:
    st.header('Visuals')   
    chart = alt.Chart(data).mark_point().encode(
        x='spec_type_desc',
        y='count()'
    )
    chart = chart.properties(
        width=500,
        height=300
    ).interactive()
    st.altair_chart(chart)
    

# # Display statistics
# st.header('Data Statistics')
# st.write(data.describe())

# # Display graph 

# st.header('Data Graph')
# chart = alt.Chart(data).mark_point().encode(
#     x='anchor_age',
#     y='count()'
# )
# st.altair_chart(chart)


full_data = settings.full_data
curr_data = settings.curr_data


data_subset = full_data[1:500]
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_KEY)
store = Chroma.from_documents(
    data_subset,
    embeddings,
    ids=[f"{item.metadata['source']}-{index}" for index, item in enumerate(data_subset)],
    collection_name="Patient-Embeddings",
    persist_directory="db"
)
settings.store = store
settings.store.persist()

# Display similar entries
st.header('Similar Patients')
query = settings.curr_data[0].page_content
docs = settings.store.similarity_search_with_score(query)
simsearch_res = [(doc[1], doc[0].page_content) for doc in docs]
simsearch_df = pd.DataFrame(simsearch_res, columns=['Similarity Score', 'Entry'])
# st.write(pd.DataFrame(simsearch_res, columns=['Similarity Score', 'Entry']))
st.dataframe(simsearch_df, column_config={"Entry": st.column_config.Column(width="large")})

# selected_entry = st.selectbox('Select an entry', data['id'])

# nbrs = NearestNeighbors(n_neighbors=5).fit(data.drop('id', axis=1)) 
# distances, indices = nbrs.kneighbors(data.loc[data['id'] == selected_entry, :].drop('id', axis=1))

# similar_entries = data.loc[indices[0], :]
# st.write(similar_entries)

col1, col2, col3 = st.columns(3)
if col2.button('Inspect EHR Data with Medical Copilot'):
    switch_page('chatbot')
