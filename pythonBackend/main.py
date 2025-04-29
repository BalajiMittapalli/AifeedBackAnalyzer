from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gradio_client import Client
from pymongo import MongoClient
import os
from bson import ObjectId

# Load MongoDB URI from environment variable (or hard-code it as shown below)
MONGODB_URI = "mongodb+srv://varunrevoori:kGpK82V7P3IxXl5E@fakedatacreation.cmpoxqz.mongodb.net/Feedbackevaluation?retryWrites=true&w=majority"

# Initialize the FastAPI app
app = FastAPI()

# Add CORS middleware to allow cross-origin requests from your frontend (React)
origins = [
    "http://localhost:3000",  # React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows only your frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Input model for the request
class ReviewRequest(BaseModel):
    review: str
    productName: str = None  # Optional
    category: str = None     # Optional

# Initialize the Gradio client
client = Client("https://24d4c17f6645833b45.gradio.live/")

# Connect to MongoDB
client_mongo = MongoClient(MONGODB_URI)
db = client_mongo["Feedbackevaluation"]
collection = db["reviews"]

# Helper function to convert ObjectId to string
def serialize_object_id(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

@app.post("/process-review")
async def process_review(request: ReviewRequest):
    review = request.review
    product_name = request.productName
    category = request.category

    try:
        # Predict Sentiment
        result1 = client.predict(
            text=review,
            api_name="/predict"      # No need for fn_index, easier
        )
        
        # Predict Classification
        result2 = client.predict(
            text=review,
            api_name="/predict_1"
        )

        # Extract labels
        sentiment_label = result1.get("predicted_label", "")
        sentiment_confidence = float(result1.get("confidence", 0))

        classification_label = result2.get("predicted_label", "")
        classification_confidence = float(result2.get("confidence", 0))
        
        # Calculate accuracy
        accuracy = round((((sentiment_confidence*100) + (classification_confidence*100)) / 2), 0)
        # Convert accuracy to integer by multiplying by 100 (now with 2 decimal places)
        accuracy = int(accuracy)  # Convert to integer

        # Final formatting
        output = {
            "category": category,
            "productName": product_name,
            "review": review,
            "classification": "Genuine" if classification_label == "LABEL_1" else "Fake",
            "sentiment": "Positive" if sentiment_label != "LABEL_0" else "Negative",
            "accuracy": accuracy  # Now it's an integer value
        }

        # Push the review data into MongoDB
        result = collection.insert_one(output)
        
        # Include ObjectId in response as a string
        output["_id"] = str(result.inserted_id)
        
        # Return the output
        return output

    except Exception as e:
        return {"error": str(e)}
