# Female Farmers Health Analysis Dashboard

## Comprehensive Analysis of Occupational Health Risks in Female Farmers

This sophisticated dashboard provides advanced data visualization, statistical analysis, and predictive modeling tools for understanding occupational health risks facing female agricultural workers.

## 🌟 Project Overview

This project addresses a critical public health challenge: understanding and mitigating occupational risks faced by female farmers. By analyzing a comprehensive dataset collected from female agricultural workers, we explore the complex relationships between:

- Working conditions and practices
- Lifestyle habits and demographic factors
- Chemical and environmental exposures
- Protective equipment usage patterns
- Resulting occupational diseases and health outcomes

The ultimate goal is to develop evidence-based prevention strategies and targeted interventions that can improve health outcomes for this vulnerable population.

## 📊 Data Analysis Pipeline

The project implements a comprehensive data analysis pipeline:

1. **Data Cleaning & Preprocessing**
   - Missing value imputation using statistical methods
   - Feature engineering and normalization
   - Categorical encoding with domain knowledge preservation
   - Outlier detection and handling

2. **Exploratory Data Analysis**
   - Numerical variable distribution analysis
   - Categorical variable pattern identification
   - Correlation exploration across domains
   - Region-specific pattern detection

3. **Advanced Statistical Analysis**
   - ANOVA tests for group differences
   - Principal Component Analysis (PCA) for dimensionality reduction
   - Multiple Correspondence Analysis (MCA) for categorical patterns
   - Combined multivariate modeling

4. **Predictive Modeling**
   - Random Forest-based risk prediction
   - Text analysis with NLP techniques
   - Scenario-based intervention modeling
   - Feature importance quantification

5. **Visualization & Reporting**
   - Interactive dashboard components
   - Comparative risk visualization
   - Regional pattern mapping
   - Recommendation generation system

## 🚀 Key Features

### Comprehensive Data Exploration
- Multidimensional analysis of 81 farmers across 61 variables
- Interactive filtering and stratification capabilities
- Temporal and regional pattern visualization
- Age, experience, and health outcome correlation analysis

### Sophisticated Risk Prediction
- Advanced ML-driven risk assessment tool
- Domain-specific risk scoring (respiratory, dermatological, neurological)
- Confidence interval calculation for predictions
- What-if scenario modeling for intervention planning

### Natural Language Processing
- Text analysis of farmer descriptions
- Automatic extraction of risk factors from text
- Keyword identification for chemical exposures
- Pattern recognition in health complaint descriptions

### Evidence-Based Recommendations
- Personalized protection strategy generation
- Age and region-specific intervention suggestions
- Chemical exposure mitigation recommendations
- Prioritized action plans based on predicted risk reduction

## 🔬 Predictive Model Details

The project employs a sophisticated hybrid predictive model combining machine learning with domain expertise:

### Model Architecture
- **Core Algorithm**: Random Forest Regressor with enhanced feature importance
- **Approach**: Hybrid knowledge-enhanced ML with causal factor integration
- **Training**: 80/20 train-test split with stratification by age groups
- **Validation**: Cross-validation with confidence interval generation

### Input Features
- Demographic data (age, experience, family structure)
- Work characteristics (hours, tasks, employment status)
- Exposure information (chemicals, biological agents, thermal)
- Protection behaviors (equipment usage patterns)
- Regional and socioeconomic indicators

### Output Metrics
- Overall health risk score (0-100)
- Domain-specific risk breakdowns
- Top contributing risk factors
- Feature importance visualization
- Personalized recommendations
- Confidence intervals for predictions

### NLP Components
- Domain-specific keyword extraction
- Context-aware text processing
- Entity recognition for agricultural terms
- Chemical-health association mapping

## 📂 Project Structure

```
agricultural-health-dashboard/
├── backend/                    # Python API server
│   ├── app/                    # API application code
│   ├── model_data/             # Trained ML models
│   └── simple_server.py        # FastAPI server implementation
├── data/                       # Data files
│   ├── female_farmers_data.xlsx # Original dataset
│   └── fixed_female_farmers_data.xlsx # Processed dataset
├── frontend/                   # React application
│   ├── public/                 # Static assets
│   └── src/                    # React components & code
│       ├── components/         # UI components
│       ├── services/           # API interaction logic
│       └── types/              # TypeScript definitions
├── 1.cleaning_process/         # Data preprocessing pipeline
├── 2.Analysis/                 # Data analysis scripts
│   ├── ANOVA/                  # Analysis of variance
│   ├── Categorical/            # Categorical data analysis
│   ├── Numerical/              # Numerical data analysis
│   └── multivariate/           # PCA & MCA analysis
└── 1.1farmers report/          # Generated analysis reports
```

## 💪 Value & Impact

This application provides critical insights that can lead to:

1. **Improved Occupational Health**: Identifying the most significant risk factors allows targeted prevention strategies
2. **Evidence-Based Policy**: Data-driven recommendations for agricultural safety regulations
3. **Regional Customization**: Recognition of region-specific patterns enables locally-tailored interventions
4. **Demographic Targeting**: Age and experience-appropriate protection strategies
5. **Resource Optimization**: Prioritization of interventions based on predicted risk reduction

## 🛠️ Running the Application

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm 8 or higher

### Quick Start

1. **Initial Setup**:
   ```bash
   setup.bat
   ```
   This script creates virtual environments and installs all dependencies for both frontend and backend.

2. **Launch Full Application**:
   ```bash
   run_app.bat
   ```
   This starts both the frontend and backend servers:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

3. **Component-Specific Launch**:
   - Frontend only: `run_frontend.bat`
   - Backend only: `run_backend.bat`

### Manual Setup (if batch files don't work)

#### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python simple_server.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Production Build
```bash
# In frontend directory
npm run build
```

## 🧪 Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build**: Vite for fast development
- **UI**: Material UI + custom Tailwind components
- **Charts**: Recharts for visualization
- **State**: React hooks and context API
- **API**: Fetch with custom service abstraction

### Backend
- **API**: FastAPI for high-performance endpoints
- **ML**: Scikit-learn for predictive modeling
- **NLP**: NLTK for text processing
- **Data**: Pandas and NumPy for data manipulation
- **Statistics**: SciPy for advanced statistical analysis

## 📚 Methodological Framework

The project is built on a robust methodological framework:

1. **Descriptive Analysis**: Understanding the data distribution and basic patterns
2. **Exploratory Analysis**: Uncovering relationships and generating hypotheses
3. **Inferential Analysis**: Testing hypotheses with appropriate statistical tests
4. **Multivariate Analysis**: Revealing complex patterns across multiple dimensions
5. **Predictive Modeling**: Building models to forecast risk and outcomes
6. **Prescriptive Analysis**: Generating actionable recommendations

## 🌍 Deployment

The frontend is deployed on Vercel, providing a publicly accessible interface. For full functionality including the prediction capabilities, the backend API needs to be running locally.

**Note**: Since the backend runs locally, the deployed frontend on Vercel will not have full functionality unless connected to a running backend instance.

## 🔍 Key Insights

Some of the most significant findings from the analysis:

1. **Family Structure Impact**: Number of children significantly influences protection behaviors
2. **Regional Protection Variations**: Distinct regional patterns in protective equipment usage
3. **Age-Experience Paradox**: Older workers with more experience don't necessarily show better protection
4. **Chemical-Protection Disconnect**: High chemical exposure often coexists with inadequate respiratory protection
5. **BMI-Cardiovascular Risk**: High prevalence of obesity (42.5%) correlates with elevated cardiovascular risks

## 👩‍💻 Contributors

- **Selma Bettaieb** - Data Analysis & Dashboard Development

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*For additional details, please refer to the technical documentation in the `1.1farmers report` directory.*
