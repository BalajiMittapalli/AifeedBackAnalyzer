const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const reviewRoutes = require("./routes/reviews")
const authRoutes = require("./routes/auth")
const Review = require("./models/Review")
const fs = require("fs");
// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/reviews", reviewRoutes)
app.use("/api/auth", authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

const fetch = require('node-fetch');  // If you're using Node.js

app.post('/process-review', async (req, res) => {
  const { review, productName, category } = req.body; // Receive inputs from frontend

  const safeProductName = productName || null;
  const safeCategory = category || null;

  try {
    // Prepare the POST body for Gradio API
    const gradioUrl = 'https://24d4c17f6645833b45.gradio.live/api/predict/';

    // Prepare both requests — fn_index 0 for /predict, 1 for /predict_1
    const [response1, response2] = await Promise.all([
      fetch(gradioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [review],  // Gradio expects text input inside an array
          fn_index: 0
        }),
      }),
      fetch(gradioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [review],
          fn_index: 1
        }),
      }),
    ]);

    // Parse JSON results
    const result1 = await response1.json();
    const result2 = await response2.json();

    console.log("Result1:", result1);
    console.log("Result2:", result2);

    // Now extract predicted_label and confidence properly
    const predictedLabel1 = result1.data?.[0]?.predicted_label || null;
    const predictedLabel2 = result2.data?.[0]?.predicted_label || null;
    const confidence1 = result1.data?.[0]?.confidence ? parseFloat(result1.data[0].confidence) : 0;
    const confidence2 = result2.data?.[0]?.confidence ? parseFloat(result2.data[0].confidence) : 0;

    console.log("Confidence1:", confidence1);
    console.log("Confidence2:", confidence2);

    // Calculate accuracy
    const accuracy = ((confidence1 + confidence2) / 2).toFixed(4);

    // Build final output
    const finalOutput = {
      category: safeCategory,
      productName: safeProductName,
      review: review,
      classification: predictedLabel2 === "LABEL_1" ? "Genuine" : "Fake",
      sentiment: predictedLabel1 === "LABEL_0" ? "Negative" : "Positive",
      accuracy: accuracy
    };

    res.json(finalOutput);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing the request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
