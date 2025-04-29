
🎯 Feedback Authenticity: Distinguishing Genuine from Fake Reviews + Sentiment Analysis


📄 Project Description
This project is an advanced Review Analyzer that detects both the authenticity and sentiment of user feedback.
It offers interactive dashboards, dynamic visualizations, and real-time insights.



🛠️ Built with:


Frontend: React.js, Next.js


Backend: Node.js, Express


Machine Learning Models: PyTorch (using DeBERTa,MBO, Unsloth, LoRA)



🧠 Genuinity Detection: Fine-tuned DeBERTa model + Monarch Butterfly Optimization (MBO)
🗣️ Sentiment Analysis: Standard DeBERTa model
🤖 Synthetic Data: Generated using LLaMA 70B
🚀 API Deployment: Powered by Gradio



✨ Features
🔍 Genuine Review Detection
Classify reviews as authentic or fake using a fine-tuned DeBERTa model.


❤️ Sentiment Analysis
Predict feedback sentiment: Positive, Negative, or Neutral.


📊 Interactive Dashboards
Clean visualization of results using lucide-react components.


💻 Modern Web Application
Built using React.js, Next.js, Node.js, and Express.



🛠️ Advanced Model Training


DeBERTa fine-tuned with MBO for genuinity.


Standard DeBERTa for sentiment classification.


Unsloth and LoRA for efficient fine-tuning.



🧪 Synthetic Data Generation
Large-scale data generation with LLaMA 70B.


🌐 API Deployment
Live model inference APIs with Gradio.


🏗️ Project Architecture


![image](https://github.com/user-attachments/assets/52fb6ef1-65ce-483a-b66c-f3c45e88e75e)




🚀 Tech Stack


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



📂 Project Structure
/review-analysis     → React frontend for submission, history, visualization
/backend              → Node.js API server (routes, models, database)
/pythonBackend        → Python backend for ML models and Gradio APIs


🎨 Frontend (review-analysis)
📝 Feedback Dashboard: Submit new feedback.


📚 Feedback History: View previous feedbacks.


📊 Visualization Reports: Graphical representation of analysis.


🛠️ Submits feedback to the Python backend for analysis.



🛠️ Backend (backend)
📡 API Endpoints: CRUD operations for feedback.



🤖 Integrates sentiment & fake review detection models.


🛢️ Saves analyzed data to MongoDB.



🧠 Models Used:

mbo_deberta → Fake review detection


deberta → Sentiment analysis



🧪 Python Backend (pythonBackend)

main.py: Manages feedback processing and model interaction.


gradio_api_server.py: Starts a live Gradio server.


requirements.txt: Lists Python dependencies.



⚠️ Important:


Run gradio_api_server.py manually to get a live Gradio link.


Update the new Gradio link inside main.py manually each time.




🔄 Workflow Summary
🖊️ User submits feedback via frontend.


🔗 Frontend sends it to Python Backend (main.py).


🧠 Python backend analyzes feedback using ML models.


🗄️ Node.js backend saves the analysis in MongoDB.



📊 User can view results and visualizations.


🛠️ Execution Commands
Frontend
cd review-analysis
npm install
npm run dev


Backend
cd backend
npm install
npm start


Python Backend
cd pythonBackend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000


Start Gradio Server
python gradio_api_server.py


(Remember to update the Gradio URL manually in main.py!)



🖼️ UI Pages Overview

📝 Feedback Dashboard

![image](https://github.com/user-attachments/assets/431ddb58-424c-4d66-bdf8-599dcebf30e3)

📚 Feedback History

![image](https://github.com/user-attachments/assets/8759e121-4dcf-459d-8ce9-da6650c98894)


📊 Visualization Reports

![image](https://github.com/user-attachments/assets/e2fd245d-d39a-44ea-8196-a603e4bf6754)


📈 Analysis Page

![image](https://github.com/user-attachments/assets/249a2a2c-edb9-450b-b26c-753ea0f22167)



✨ Additional Features
🛒 Category-wise Product Feedback
Filter feedback by product categories for deeper insights.


🕒 Feedback History Tracking
Track changes over time with timestamps.


📊 Dynamic Visualizations
Real-time updates based on filters.


🚀 Future Enhancements
🌍 Multilingual Support
Support feedback in multiple languages.


🔄 Automated Gradio Deployment
Auto-update Gradio links without manual replacement.


🧑‍💼 Role-Based Access Control
Different views for admins, managers, and users.


📱 Mobile App Extension
Mobile app for on-the-go feedback and analysis.



⚡ Important Notes

Ensure MongoDB, Node.js backend, and Python backend are active before running the application.


Always manually update the Gradio link inside main.py after starting Gradio (due to hardware constraints).
