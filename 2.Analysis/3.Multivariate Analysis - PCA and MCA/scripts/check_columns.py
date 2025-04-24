import pandas as pd

# Load the data
df = pd.read_excel("fixed_female_farmers_data.xlsx")

# Print column names
print("Column names in the dataset:")
for i, col in enumerate(df.columns):
    print(f"{i}: {col}")

# Print a few rows to see the data structure
print("\nFirst 2 rows of data:")
print(df.head(2).to_string())

# Check for health-related columns
health_keywords = ['trouble', 'cardio', 'respiratoire', 'cognitif', 'neurologique', 'cutané', 'phanère']
print("\nHealth-related columns:")
for col in df.columns:
    if any(keyword.lower() in col.lower() for keyword in health_keywords):
        print(f"Found: {col}")
