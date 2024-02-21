import streamlit as st
from streamlit_extras.switch_page_button import switch_page
from langchain.document_loaders.csv_loader import CSVLoader
# import csv
import tempfile
import settings


settings.init()

st.set_page_config(page_title="File Upload",
                   layout="centered",
                   initial_sidebar_state="collapsed") 
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


uploaded_file = st.file_uploader("Upload Current Patient Information", type = ['csv'], 
                                 accept_multiple_files=False)


if uploaded_file is not None:
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        tmp_file.write(uploaded_file.getvalue())
        tmp_file_path = tmp_file.name

    curr_loader = CSVLoader(file_path=tmp_file_path, encoding="utf-8", csv_args={
                'delimiter': ','})
    curr_data = curr_loader.load()
    settings.curr_data = curr_data

    full_loader = CSVLoader(file_path="./partial_microbiologyevents.csv")
    full_data = full_loader.load()
    settings.full_data = full_data


    st.write("File uploaded! Running Analytics...")
    col1, col2, col3 = st.columns(3)
    if col2.button('Inspect EHR Data'):
        switch_page('analytics')

