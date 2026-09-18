
import logging
import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


# -------------------------
# Load model
# -------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    force=True
)

logger = logging.getLogger(__name__)

logger.info("FastAPI application started")


try:

    model = joblib.load("model/model.pkl")
    logger.info("Model loaded successfully")

# Load preprocessor
    preprocessor = joblib.load("model/preprocessor.pkl")
    logger.info("Preprocessor loaded successfully")

except Exception as e:
    logger.exception(f"Error loading model or preprocessor: {e}")
    raise



# -------------------------
# Create FastAPI app
# -------------------------

app = FastAPI()

logger.info("FastAPI application created")
# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://used-car-price-estimation-1.onrender.com"
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("CORS middleware added to FastAPI application")


# -------------------------
# Input data
# -------------------------

class CarData(BaseModel):

    brand: str
    fuel_type: str
    transmission: str
    service_history: str
    insurance_valid: str
    color: str

    make_year: int
    mileage_kmpl: float
    engine_cc: int
    owner_count: int
    accidents_reported: int




@app.get("/")
def home():

    logger.info("Home route accessed")

    return {
        "message": "FastAPI is working"
    }


# -------------------------
# Prediction route
# -------------------------

@app.post("/predict")
def predict(data: CarData):

    try:

        logger.info(
            f"Prediction request received for brand={data.brand}"
        )


        # -------------------------
        # Create DataFrame
        # -------------------------

        input_data = pd.DataFrame([{

            "brand": data.brand,

            "fuel_type": data.fuel_type,

            "transmission": data.transmission,

            "service_history": data.service_history,

            "insurance_valid": data.insurance_valid,

            "color": data.color,

            "make_year": data.make_year,

            "mileage_kmpl": data.mileage_kmpl,

            "engine_cc": data.engine_cc,

            "owner_count": data.owner_count,

            "accidents_reported":
                data.accidents_reported
        }])


        logger.info(
            "Input data converted to DataFrame"
        )


        # -------------------------
        # Preprocess
        # -------------------------

        transformed_data = (
            preprocessor.transform(input_data)
        )


        logger.info(
            "Preprocessing completed"
        )


        # -------------------------
        # Prediction
        # -------------------------

        prediction = model.predict(
            transformed_data
        )

        predicted_price = float(
            prediction[0]
        )


        # -------------------------
        # Logging
        # -------------------------

        logger.info(
            f"Prediction completed successfully: "
            f"brand={data.brand}, "
            f"predicted_price={predicted_price}"
        )


        # -------------------------
        # Response
        # -------------------------

        return {

            "message": "Prediction successful",

            "predicted_price":
                predicted_price,

            "brand":
                data.brand,

            "fuel_type":
                data.fuel_type,

            "transmission":
                data.transmission,

            "service_history":
                data.service_history,

            "insurance_valid":
                data.insurance_valid,

            "color":
                data.color,

            "make_year":
                data.make_year,

            "mileage_kmpl":
                data.mileage_kmpl,

            "engine_cc":
                data.engine_cc,

            "owner_count":
                data.owner_count,

            "accidents_reported":
                data.accidents_reported
        }


    except Exception as e:

        logger.exception(
            f"Error during prediction: {e}"
        )

