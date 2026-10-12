# 🚗 Used Car Price Estimation | Machine Learning

### Predicting Used Car Prices with Machine Learning, FastAPI, React & AI

An end-to-end Machine Learning project that predicts the estimated price of a used car based on its specifications and condition.

The application combines a trained Machine Learning model with a FastAPI backend and a React frontend to provide an interactive price prediction experience. It also integrates a Large Language Model (LLM) to generate natural-language explanations of predictions.

---

## 📌 Table of Contents

- [📖 Project Overview](#-project-overview)
- [🎯 Objectives](#-objectives)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📊 Dataset](#-dataset)
- [🔍 Project Workflow](#-project-workflow)
- [🤖 Machine Learning Models](#-machine-learning-models)
- [🏆 Best Model](#-best-model)
- [🏗️ Application Architecture](#️-application-architecture)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation and Setup](#️-installation-and-setup)
- [🔐 Environment Variables](#-environment-variables)
- [🌐 Deployment](#-deployment)
- [📈 Evaluation Metrics](#-evaluation-metrics)
- [💡 Key Learnings](#-key-learnings)
- [🚀 Future Improvements](#-future-improvements)
- [👨‍💻 Author](#-author)

---

## 📖 Project Overview

Estimating the value of a used car can be challenging because its price depends on several factors, including the brand, manufacturing year, mileage, engine capacity, ownership history, and vehicle condition.

This project uses Machine Learning to estimate used car prices from these features.

The project covers the complete application workflow, from data preprocessing and exploratory data analysis to model training, API development, frontend integration, and deployment.

The application also integrates an LLM API to provide explanations of price predictions, helping users better understand the results.

## 🎯 Objectives

- 📊 Analyze and preprocess used car data.
- 🔍 Perform exploratory data analysis (EDA).
- 🤖 Train and compare multiple regression algorithms.
- 📈 Evaluate model performance using regression metrics.
- 🏆 Select a suitable model based on evaluation results.
- ⚡ Build a REST API using FastAPI.
- 🎨 Develop an interactive frontend using React.
- 🧠 Integrate an LLM API for prediction explanations.
- 🔐 Manage API credentials using environment variables.
- ☁️ Deploy the backend using Render.

## ✨ Features

- 🚘 **Car Price Prediction:** Estimate used car prices based on vehicle details.
- 🤖 **Machine Learning:** Train and compare multiple regression models.
- 📊 **Data Analysis:** Explore vehicle data and identify useful patterns.
- ⚡ **FastAPI Backend:** Serve predictions through an API.
- 🎨 **React Frontend:** Provide an interactive user interface.
- 🧠 **AI-Powered Explanations:** Generate natural-language explanations using an LLM API.
- 🔐 **Environment Configuration:** Store API credentials outside the source code.
- 📝 **Application Logging:** Record application events and errors for troubleshooting.
- ☁️ **Deployment:** Host the backend using Render.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| 🐍 Python | Core programming language |
| 🐼 Pandas | Data manipulation and analysis |
| 🔢 NumPy | Numerical operations |
| 🤖 Scikit-learn | Machine Learning and preprocessing |
| 📦 Joblib | Saving and loading trained models |
| 📓 Jupyter Notebook | Data analysis and model training |
| ⚡ FastAPI | Backend API development |
| 🚀 Uvicorn | Running the FastAPI application |
| ⚛️ React | Frontend development |
| 🟨 JavaScript | Frontend functionality |
| 🎨 CSS | Interface styling |
| 🧠 Gemini API | LLM-generated explanations |
| 🔐 Environment Variables | API credential management |
| ☁️ Render | Backend deployment |
| 🐙 Git & GitHub | Version control and project hosting |

## 📊 Dataset

The project uses a used car price dataset containing approximately **10,000 records and 12 columns**.

The dataset includes vehicle specifications and information about ownership and condition.

### 🚘 Input Features

| Feature | Description |
|---|---|
| `brand` | Car manufacturer |
| `fuel_type` | Type of fuel used |
| `transmission` | Transmission type |
| `service_history` | Vehicle service history |
| `insurance_valid` | Insurance validity status |
| `color` | Car color |
| `make_year` | Vehicle manufacturing year |
| `mileage_kmpl` | Mileage in kilometres per litre |
| `engine_cc` | Engine capacity in cubic centimetres |
| `owner_count` | Number of previous owners |
| `accidents_reported` | Number of reported accidents |

### 🎯 Target Variable

`price_usd`

The target variable represents the used car price in US dollars.

## 🔍 Project Workflow

The project follows these stages:

1. 📥 **Data Collection:** Load the used car dataset.
2. 🧹 **Data Preprocessing:** Prepare the data for analysis and modelling.
3. 📊 **Exploratory Data Analysis:** Examine distributions, relationships, and data patterns.
4. 🔧 **Feature Preprocessing:** Prepare numerical and categorical features.
5. 🤖 **Model Training:** Train multiple regression algorithms.
6. 📈 **Model Evaluation:** Compare models using regression metrics.
7. 🏆 **Model Selection:** Select the best-performing model based on evaluation results.
8. 💾 **Model Saving:** Save the trained model and preprocessing pipeline.
9. ⚡ **API Development:** Build prediction endpoints using FastAPI.
10. 🎨 **Frontend Development:** Connect a React interface to the backend.
11. 🧠 **LLM Integration:** Generate prediction explanations using an external LLM API.
12. ☁️ **Deployment:** Deploy the backend and configure the required environment variables.

## 🤖 Machine Learning Models

Multiple regression algorithms were trained and compared to identify a suitable model for used car price prediction.

### Models

- 🌳 Random Forest Regressor
- 🌲 Decision Tree Regressor
- 📈 Linear Regression
- 🚀 AdaBoost Regressor
- 📊 Gradient Boosting Regressor
- 🔬 Additional regression model
- 🔬 Additional regression model

The complete list should match the seven models actually trained in the model training notebook.

### ⚙️ Selected Model Configurations

**Random Forest Regressor**
- Number of estimators: 200
- Maximum depth: 10
- Minimum samples to split: 5
- Minimum samples per leaf: 2

**Decision Tree Regressor**
- Maximum depth: 10
- Minimum samples to split: 5
- Minimum samples per leaf: 2

**Linear Regression**
- Default Scikit-learn configuration

**AdaBoost Regressor**
- Number of estimators: 100
- Learning rate: 0.05

**Gradient Boosting Regressor**
- Number of estimators: 200
- Learning rate: 0.05
- Maximum depth: 3

## 🏆 Best Model

**Linear Regression** was selected as the final model based on the evaluation results.

The model achieved an approximate **test R² score of 0.8743** in the reported experiment.

This means that the model explains approximately 87.43% of the variation in car prices in the test dataset. It does not mean that every prediction is 87.43% accurate.

The selected model and its preprocessing pipeline are saved and used by the FastAPI backend to generate predictions.

Model selection is based on evaluation results rather than assuming that a more complex algorithm will always perform better.

## 🏗️ Application Architecture

The application connects the frontend, backend, Machine Learning model, and LLM service.

### 🔄 Prediction Flow

```text
              👤 User
                 |
                 v
         ⚛️ React Frontend
                 |
                 v
          ⚡ FastAPI Backend
                 |
                 v
        🔧 Input Preprocessing
                 |
                 v
       🤖 Trained ML Model
                 |
                 v
       💰 Predicted Car Price
                 |
                 v
          ⚡ FastAPI Response
                 |
                 v
         ⚛️ React Frontend
                 |
                 v
       📊 Display Prediction

    🧠 LLM API
         |
         v
    💬 Prediction Explanation
```

### 🧩 Component Responsibilities

- **React:** Collects vehicle details and displays prediction results.
- **FastAPI:** Receives requests, processes inputs, and returns predictions.
- **Preprocessing Pipeline:** Transforms the input into the format expected by the model.
- **Machine Learning Model:** Estimates the car price.
- **LLM API:** Generates a natural-language explanation when configured and available.
- **Render:** Hosts the deployed backend application.

The Machine Learning model predicts the price. The LLM provides an explanation; it does not replace the trained regression model.

## 📂 Project Structure

```text
Used Car Price Estimation/
│
├── .vscode/
│
├── backend/
│   └── app.py
│
├── Data/
│   ├── clean_data/
│   └── raw_data/
│       └── used_car_price_dataset_extended.csv
│
├── frontend_UI/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── model/
│   ├── model.pkl
│   └── preprocessor.pkl
│
├── notebook/
│   ├── Data preprocessing.ipynb
│   ├── EDA.ipynb
│   └── model_training.ipynb
│
├── report/
│
├── app.log
├── README.md
└── requirements.txt
```

*Note: Update the model filenames and frontend contents above if they differ from your actual repository.*

## ⚙️ Installation and Setup

### 📋 Prerequisites

Install the following tools:

- Python
- Node.js and npm
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/akashbulids/Used-Car-Price-Estimation
```

Navigate to the project directory:

```bash
cd "Used Car Price Estimation"
```

### 2️⃣ Create a Python Virtual Environment

```bash
python -m venv venv
```

Activate it in Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3️⃣ Install Backend Dependencies

```bash
python -m pip install -r requirements.txt
```

### 4️⃣ Start the FastAPI Backend

From the project root, if `backend/app.py` exposes an `app` FastAPI instance:

```bash
python -m uvicorn backend.app:app --reload
```

If your project uses a different module path, adjust the command accordingly.

### 5️⃣ Open API Documentation

Once the backend is running, open:

```text
http://127.0.0.1:8000/docs
```

Use the interactive Swagger interface to explore and test the available endpoints.

### 6️⃣ Install Frontend Dependencies

Open a separate terminal:

```bash
cd frontend_UI
```

Install the dependencies:

```bash
npm install
```

### 7️⃣ Run the React Application

```bash
npm run dev
```

Open the local address displayed in your terminal.

Make sure the frontend API configuration points to the correct backend URL.

## 🔐 Environment Variables

The application uses an external LLM API to generate explanations of price predictions.

Sensitive API credentials should be stored in environment variables rather than hardcoded in the source code.

### Example

```env
GEMINI_API_KEY=your_api_key_here
```

Use the exact environment variable name expected by your backend implementation.

### 🔒 Security Best Practices

- Never commit API keys to GitHub.
- Keep `.env` files out of version control.
- Configure production credentials in Render's environment variable settings.
- Never expose private API keys in React frontend code.
- Handle external API errors gracefully.
- Keep price prediction functionality independent of the optional LLM explanation service where possible.

The LLM feature requires valid credentials and an available API service.

## 🌐 Deployment

The FastAPI backend is deployed using **Render**.

### 🚀 Deployment Configuration

- **Backend Framework:** FastAPI
- **Application Server:** Uvicorn
- **Hosting Platform:** Render
- **ML Model:** Saved regression model and preprocessing pipeline
- **LLM Integration:** Environment-based API credentials

Configure the required Python dependencies, start command, and environment variables in Render.

### 🔗 Project Links

| Resource | Link |
|---|---|
| 🐙 GitHub Repository | Add your repository URL |
| 🌐 Live Frontend | Add your deployed React URL |
| ⚡ Backend API | Add your Render backend URL |
| 📚 API Documentation | Your backend URL followed by `/docs` |

Only include working deployment links.

## 📈 Evaluation Metrics

The project uses regression metrics to evaluate model performance.

### R² Score

Measures how well the model explains variation in the target variable. A higher score generally indicates a better fit, although evaluation results must be interpreted in context.

### Mean Absolute Error (MAE)

Measures the average absolute difference between actual prices and predicted prices. A lower MAE generally indicates smaller prediction errors.

Model evaluation helps compare algorithms and select a model based on its performance on unseen data.

## 💡 Key Learnings

Through this project, I gained practical experience in:

- 🧹 Data preprocessing and exploratory data analysis.
- 🤖 Training and comparing regression algorithms.
- 📊 Evaluating Machine Learning models.
- 💾 Saving and loading trained models.
- ⚡ Developing REST APIs using FastAPI.
- ⚛️ Integrating a React frontend with a Python backend.
- 🧠 Connecting an external LLM API.
- 🔐 Managing API credentials using environment variables.
- 📝 Using application logs to troubleshoot errors.
- ☁️ Deploying a backend application using Render.

## 🚀 Future Improvements

- 📊 Experiment with additional regression algorithms and hyperparameter tuning.
- 🎯 Improve prediction quality through further data analysis and validation.
- 🧪 Add automated tests for model predictions and API endpoints.
- 📈 Monitor model performance and data quality.
- ⚡ Improve API reliability and error handling.
- 🌐 Improve application deployment and availability.

## 👨‍💻 Author

**Akash R**

Aspiring Machine Learning Engineer

🐙 GitHub: [akashbulids](https://github.com/akashbulids)

## 🌐 Live Demo

[🚀 Click Here to Open Live Website](https://used-car-price-estimation.onrender.com)

---

⭐ Thank you for checking out this project!
