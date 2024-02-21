import streamlit as st

def init():
    global curr_data, full_data
    curr_data = None
    full_data = None
    store = None


# def hide_footer():
#     hide_streamlit_style = """
#             <style>
#             #MainMenu {visibility: hidden;}
#             footer {visibility: hidden;}
#             </style>
#             """
#     st.markdown(hide_streamlit_style, unsafe_allow_html=True)
