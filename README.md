## 🚗 Used Car Resale Price Prediction

---

## 📌 Project Overview

This project predicts the **resale price of a used car** using Machine Learning.

---

## 🎯 Problem Statement

Used car prices depend on factors such as:

* Car year
* Mileage
* Engine size
* Fuel type
* Previous owners
* Brand
* Transmission
* Service history
* Accident history
* Insurance

Machine Learning is used to predict a suitable resale price based on these features.

---

## 📊 Dataset

* Rows: **10,000**
* Columns: **12**
* Target: **price_usd**

### Features

* make_year
* mileage_kmpl
* engine_cc
* fuel_type
* owner_count
* price_usd
* brand
* transmission
* color
* service_history
* accidents_reported
* insurance_valid

---

## 🛠️ Technologies

* Python
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Scikit-learn

---

## 📈 EDA

* Data distribution
* Outlier analysis
* Countplot
* Scatter plot
* Feature correlation

---

## 🧹 Data Preprocessing

* Handle missing values
* Fill categorical missing values with `Unknown`
* Detect outliers using IQR
* One-Hot Encoding
* Train-Test Split

**Train:** 70%
**Test:** 30%

---

## 💼 Business Insights

* Newer cars generally have higher prices.
* Engine size affects car price.
* Petrol cars are the most common.
* Nissan has the highest number of cars.
* Most cars have valid insurance.
* Different colors have good sales.

---

## 🤖 Machine Learning Models

* Linear Regression
* Decision Tree
* Random Forest
* Gradient Boosting
* XGBoost

---

## 📏 Evaluation Metrics

* MAE
* MSE
* RMSE
* R² Score

---

## 🏆 Best Model

**Linear Regression**

Linear Regression achieved the best performance among the tested models.

---

## 🔄 Workflow

```text
Data
 ↓
Cleaning
 ↓
EDA
 ↓
Preprocessing
 ↓
Train-Test Split
 ↓
Model Training
 ↓
Model Evaluation
 ↓
Best Model
 ↓
Price Prediction
```

---

## 👨‍💻 Author

**Akash**
