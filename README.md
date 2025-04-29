
# 🎯 Feedback Authenticity: Distinguishing Genuine from Fake Reviews + Sentiment Analysis

## 📄 Project Description
An advanced Review Analyzer that detects both the authenticity and sentiment of user feedback.
It offers interactive dashboards, dynamic visualizations, and real-time insights.

## 🛠️ Built with
- **Frontend**: React.js, Next.js
- **Backend**: Node.js, Express
- **Machine Learning Models**: PyTorch (DeBERTa, MBO, Unsloth, LoRA)

## 🧠 Genuinity Detection
Fine-tuned DeBERTa model + Monarch Butterfly Optimization (MBO).

## 🗣️ Sentiment Analysis
Standard DeBERTa model.

## 🤖 Synthetic Data
Generated using LLaMA 70B.

## 🚀 API Deployment
Powered by Gradio.

## ✨ Features
- 🔍 **Genuine Review Detection**: Classify reviews as authentic or fake using a fine-tuned DeBERTa model.
- ❤️ **Sentiment Analysis**: Predict feedback sentiment: Positive, Negative, or Neutral.
- 📊 **Interactive Dashboards**: Clean visualization of results using lucide-react components.
- 💻 **Modern Web Application**: Built with React.js, Next.js, Node.js, and Express.

## 🛠️ Advanced Model Training
- DeBERTa fine-tuned with MBO for genuinity.
- Standard DeBERTa for sentiment classification.
- Unsloth and LoRA for efficient fine-tuning.

## 🧪 Synthetic Data Generation
Large-scale data generation with LLaMA 70B.

## 🌐 API Deployment
Live model inference APIs with Gradio.

## 🏗️ Project Architecture
> (Insert architecture diagram if available)

## 🚀 Tech Stack

| Category                | Technology/Tool                          | Purpose                                  |
|--------------------------|------------------------------------------|------------------------------------------|
| Frontend                 | React.js, Next.js, lucide-react          | Web application UI and visualization    |
| Backend                  | Node.js, Express, FastAPI                | Server-side logic                       |
| Database                 | MongoDB                                  | Data storage and management             |
| Model Training Framework | PyTorch                                  | Building and training ML models         |
| LLM Fine-tuning          | Unsloth, LoRA                            | Efficient LLM fine-tuning               |
| Sentiment Analysis Model | DeBERTa                                  | Sentiment classification                |
| Genuinity Detection Model| DeBERTa + Monarch Butterfly Optimization | Authenticity detection                  |
| Data Generation          | LLaMA 70B                                | Synthetic data generation               |
| API Deployment           | Gradio                                   | Model inference hosting                 |

## 📂 Project Structure
```
/review-analysis     → React frontend for submission, history, visualization
/backend              → Node.js API server (routes, models, database)
/pythonBackend        → Python backend for ML models and Gradio APIs
```

## 🎨 Frontend (review-analysis)
- 📝 Feedback Dashboard: Submit new feedback.
- 📚 Feedback History: View previous feedbacks.
- 📊 Visualization Reports: Graphical representation of analysis.
- 🛠️ Submits feedback to the Python backend for analysis.

## 🛠️ Backend (backend)
- 📡 API Endpoints: CRUD operations for feedback.
- 🤖 Integrates sentiment & fake review detection models.
- 🛢️ Saves analyzed data to MongoDB.

## 🧠 Models Used
- **mbo_deberta** → Fake review detection
- **deberta** → Sentiment analysis

## 🧪 Python Backend (pythonBackend)
- **main.py**: Manages feedback processing and model interaction.
- **gradio_api_server.py**: Starts a live Gradio server.
- **requirements.txt**: Lists Python dependencies.

⚠️ **Important**:
- Run `gradio_api_server.py` manually to get a live Gradio link.
- Update the Gradio link inside `main.py` manually each time.

## 🔄 Workflow Summary
1. 🖊️ User submits feedback via frontend.
2. 🔗 Frontend sends it to Python Backend (`main.py`).
3. 🧠 Python backend analyzes feedback using ML models.
4. 🗄️ Node.js backend saves the analysis in MongoDB.
5. 📊 User can view results and visualizations.

## 🛠️ Execution Commands

**Frontend**
```bash
cd review-analysis
npm install
npm run dev
```

**Backend**
```bash
cd backend
npm install
npm start
```

**Python Backend**
```bash
cd pythonBackend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Start Gradio Server**
```bash
python gradio_api_server.py
```
(Remember to update the Gradio URL manually in `main.py`!)

## 🖼️ UI Pages Overview
- 📝 Feedback Dashboard
- 📚 Feedback History
- 📊 Visualization Reports
- 📈 Analysis Page

## ✨ Additional Features
- 🛒 Category-wise Product Feedback
- 🕒 Feedback History Tracking
- 📊 Dynamic Visualizations

## 🚀 Future Enhancements
- 🌍 Multilingual Support
- 🔄 Automated Gradio Deployment
- 🧑‍💼 Role-Based Access Control
- 📱 Mobile App Extension

⚡ **Important Notes**
- Ensure MongoDB, Node.js backend, and Python backend are active before running the application.
- Always manually update the Gradio link inside `main.py` after starting Gradio.
