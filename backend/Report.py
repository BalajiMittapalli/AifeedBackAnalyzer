import google.generativeai as genai

# Replace with your actual API key
GOOGLE_API_KEY = ""  # Replace with your actual Gemini API key
genai.configure(api_key=GOOGLE_API_KEY)


def analyze_feedback_with_gemini(feedback, category=None, product=None):
    """
    Analyzes feedback text using the Gemini API to determine genuineness,
    sentiment, and key phrases.

    Args:
        feedback (str): The feedback text to analyze.
        category (str, optional): The category of the product (e.g., "phone", "car"). Defaults to None.
        product (str, optional): The name of the product. Defaults to None.

    Returns:
        str: The analysis result from the Gemini API, or an error message.
    """
    
    model_name = "gemini-2.5-flash-preview-04-17" 
    try:
        model = genai.GenerativeModel(model_name)
    except Exception as e:
        return f"Error initializing model: {e}"
    '''
    prompt = f"""
    Analyze the following feedback:
    "{feedback}"

    Provide the following information:

    - Feedback Type: Is the feedback genuine or not genuine?
    - Reasoning: Explain why you classified the feedback as genuine or not genuine.
    - Sentiment: What is the sentiment of the feedback (positive, neutral, or negative)?
    - Key Phrases: List the key phrases detected in the feedback.

    {'Category: ' + category if category else ''}
    {'Product: ' + product if product else ''}

    Format the output as follows:

    Feedback Type: <genuine or not genuine>
    Reasoning: <explanation>
    Sentiment: <positive, neutral, or negative>
    Key Phrases:
    - <key phrase 1>
    - <key phrase 2>
    - <key phrase 3>
    """
    '''
    prompt=f"""
    you are a review analyzer model which will analyze the given reviews and answer wether it is genuine or not. spam or not. you will also tell me why it is classified as it is. also you need to give me evaluation metrics as a trained model which identifies weather spam or not based on some evaluation metrics like threshold values. you need to give me these threshold values as well.
    so I will give you the review to you, analyze them and tell me in the way i told you to
    I want a single word answer of weather it is a fake review or not. if you think it is unhelpful then make it as a spam review and not a genuine one.
    so think about if it is useful or not.
    give the reason for the classification in single line. do not exaggerate anything.I also need a feild sentiment whether it is positive or negative or neutral.
    I need another feild of key phrases detected from the feedback.
    also I want you to give the threshold value and evaluation metrics which should have F1 Score,Precision,Recall,Accuracy
    don't give too much text in the threshold values. and you also should not provide any reason for the evaluation metric. 
    just give everything as a side heading and a metric score beside.
    even the reason as side heading and reason beside it.
    also the genuine or not in a single side heading and one value for it.
    give all this in json format. This is the main part. 
    review: {feedback}
    """

    try:
        response = model.generate_content(prompt)
        if response.text:
            return response.text
        else:
            return "Error: Empty response from Gemini API."
    except Exception as e:
        error_message = f"Error generating content with Gemini: {e}"
        print(error_message)
        return error_message


if __name__ == "__main__":
    # List available models
    print("--- Available Gemini Models ---")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"{m.name}")
    print("-----------------------------")

    # Get feedback and optional category and product from the user
    feedback_text = input("Enter the feedback text: ")
    category_input = input("Enter the category (optional): ")
    product_input = input("Enter the product name (optional): ")

    # Call the function to analyze the feedback
    analysis_result = analyze_feedback_with_gemini(
        feedback_text, category_input, product_input
    )

    # Print the analysis result
    print("\n--- Analysis Result ---")
    print(analysis_result)
