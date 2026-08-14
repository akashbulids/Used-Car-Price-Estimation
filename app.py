import streamlit as st
import pandas as pd
import joblib
import os
# Load saved files
model = joblib.load("notebook/model.pkl")
columns = joblib.load("notebook/columns.pkl")
encoder = joblib.load("notebook/encoder.pkl")

print(os.path.exists("notebook/model.pkl"))

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

    input_data=pd.get_dummies(input_data,
         columns=[
            "brand",
            "fuel_type",
            "transmission",
            "service_history",
            "color"
                          ])

    input_data["insurance_valid"] = encoder.transform(
        input_data["insurance_valid"]
    )

    input_data = input_data.reindex(
    columns=columns,
    fill_value=0
    )

    prd =model.predict(input_data)

    st.success(
    f"Predicted Price: ${prd[0]:,.2f}"
    )

