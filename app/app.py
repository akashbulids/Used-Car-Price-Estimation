import streamlit as st
import pandas as pd
import joblib
import os
# Load saved files
model = joblib.load(r"C:\Users\akash\OneDrive\Documents\ML project\Used Car Price Estimation\notebook\model/model.pkl")
preprocessor = joblib.load(r"C:\Users\akash\OneDrive\Documents\ML project\Used Car Price Estimation\notebook\model/preprocessor.pkl")

st.title("Used Car Price Prediction")

brand=st.selectbox("Brands",[ 'Chevrolet',      'Honda',        'BMW',    'Hyundai',     'Nissan',
      'Tesla',     'Toyota',        'Kia', 'Volkswagen',       'Ford'])
fuel = st.selectbox('fuel_type',['Petrol', 'Diesel', 'Electric'])
transmission = st.selectbox('transmission',['Manual', 'Automatic'])
color=st.selectbox(
'color',['White', 'Black', 'Blue', 'Red', 'Gray', 'Silver'])
service_history = st.selectbox('service_history',['yes','no','unknown'])
insurance_valid = st.selectbox('insurance_valid',['No', 'Yes'])
make_year=st.number_input('make_year',1990, 2026, 2020)
mileage_kmpl=st.number_input('mileage_kmpl',0.0,100.0,0.0)
owner_count =st.number_input('owner_count',0.0,50.0,0.0)
accidents_reported = st.number_input('accidents_reported',0.0,100.0,0.0)
engine_cc=st.number_input('engine_cc',0.0,100000.0,4000.0)

if st.button("Predict Price"):

    input_data = pd.DataFrame({
        "brand": [brand],
        "fuel_type": [fuel],
        "transmission": [transmission],
        "service_history": [service_history],
        "insurance_valid": [insurance_valid],
        "color": [color],
        "make_year": [make_year],
        "mileage_kmpl": [mileage_kmpl],
        "engine_cc": [engine_cc],
        "owner_count": [owner_count],
        "accidents_reported": [accidents_reported]  
    })
    input_processed = preprocessor.transform(input_data)
    

    prd =model.predict(input_processed)

    st.success(
    f"Predicted Price: ${prd[0]:,.2f}"
    )

