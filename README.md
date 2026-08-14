                        Used Car Reselling price Prdication

 Project Overview
 _________________

 * This project pradict the  Used Car Reselling price using Machine Learning    

 Problem Statement
 __________________

* Fixing the price of a used car manually takes a lot of time because the price depends on feature such as car year, mileage, engine size, and number of previous owners. Our project uses machine learning to predict a suitable resale price based on these car details

 Dataset

 rowa:10,000
 columns:12

 ----------
  1. make_year         
  2. mileage_kmpl        1
  3. engine_cc             
  4. fuel_type             
  5. owner_count         
  6. price_usd           
  7. brand                  
  8. transmission         
  9. color                   
  10. service_history        
  11. accidents_reported   
  12. insurance_valid     

  Technologies Used
  ___________________

 1. pandas
 2. numpy
 3. maltplot
 4. seobone
 5. sklearn

 EDA Procces
 ____________

 1. Checking the data Distipution
 2. Checking Outliler
 3. I use the Countplot Checking the how many times each category appears in a dataset
 4. A Scatter Plot is used to show the relationship (correlation)

 Distripution:

Analyze the distribution of important numerical features:

1. year distripution  
2. mileage_kmpl
3. engine_cc
4. price_usd
5. accidents_reported

Feature Correlation Analysis:

1.    year vs price_usd
2.    mileage_kmpl vs price_usd
3.    engine_cc vs price_usd
4.    accidents_reported vs price_usd

 * EDA i perform the understand the  distribution ans checking the  Feature Correlation Analysis the numerical feature using the feature year distripution  mileage_kmpl,engine_cc, accidents_reported target varible is price_usd,

Data preproccessin:
___________________

1. Handling the null values . Null values persent the Catgorical Columns Fill the Unkowan.

2. Detect tha Outlier using IQR And Boxplot Test, i didn't Remove the all outlier values this all real time possible values

3. i convert the text to numnber useing encoding One Hot Lable Mathod   

4. train-test split i give the data in train 70% and test 30%


 Business Insights:

 1. The cars years increase car price also increase
 2.  The cars engine_cc decrease and price also decrese
 3. Mostly petrol car highest selling and second deisal. very low selling in automatic compare the manual
 4. nission car high selling in your company and second the selling Volkswagen and remaining car is modertate sales 
 5. All car colors have good sales
 6. mostly all cars insurance vaild and few cars only the invaild 
 7. 2015 cars have the highest average selling price ($17,647.63), and 2018 cars ($16,945.60).

 
Machine Learning Models:

1. Linear Regression
2. Decision Tree
3. Random Forest
4. Gradient Boosting / XGBoost etc.

Model Evaluation

1. MAE
2. MSE
3. RMSE
4. R² Score

Best Model:

Linear Regression



     

   

  
