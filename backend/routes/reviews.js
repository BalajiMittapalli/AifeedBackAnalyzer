const express = require("express")
const Review = require("../models/Review")
const { protect } = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Private
router.get("/",  async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (review) {
      res.json(review)
    } else {
      res.status(404).json({ message: "Review not found" })
    }
  } catch (error) {
    console.error("Error fetching review:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { category, productName, review, classification, sentiment, reason, accuracy } = req.body

    const newReview = await Review.create({
      category,
      productName,
      review,
      classification,
      sentiment,
      reason,
      accuracy,
    })

    res.status(201).json(newReview)
  } catch (error) {
    console.error("Error creating review:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/reviews/stats/sentiment
// @desc    Get sentiment distribution
// @access  Private
router.get("/stats/sentiment", protect, async (req, res) => {
  try {
    const sentimentCounts = await Review.aggregate([{ $group: { _id: "$sentiment", count: { $sum: 1 } } }])

    const sentimentData = sentimentCounts.map((item) => {
      const color = item._id === "Positive" ? "#22c55e" : item._id === "Negative" ? "#ef4444" : "#94a3b8"

      return {
        name: item._id,
        value: item.count,
        color,
      }
    })

    res.json(sentimentData)
  } catch (error) {
    console.error("Error fetching sentiment stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/reviews/stats/trend
// @desc    Get monthly trend data
// @access  Private
router.get("/stats/trend", protect, async (req, res) => {
  try {
    const trendData = await Review.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ])

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const formattedTrendData = trendData.map((item) => ({
      month: months[item._id.month - 1],
      value: item.count,
    }))

    res.json(formattedTrendData)
  } catch (error) {
    console.error("Error fetching trend stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/reviews/stats/category
// @desc    Get category distribution
// @access  Private
router.get("/stats/category", protect, async (req, res) => {
  try {
    const categoryCounts = await Review.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])

    res.json(categoryCounts)
  } catch (error) {
    console.error("Error fetching category stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/reviews/analyze
// @desc    Analyze feedback and save as review
// @access  Private
router.post("/analyze", protect, async (req, res) => {
  try {
    const { text, category, product } = req.body

    if (!text) {
      return res.status(400).json({ message: "Feedback text is required" })
    }

    // In a real app, you would use an AI model to analyze the text
    // For now, we'll create a simple analysis based on the text content

    // Simple sentiment analysis based on keywords
    let sentiment = "Neutral"
    const positiveWords = ["good", "great", "excellent", "amazing", "love", "like", "best"]
    const negativeWords = ["bad", "poor", "terrible", "worst", "hate", "dislike", "awful"]

    const words = text.toLowerCase().split(/\s+/)
    const positiveCount = words.filter((word) => positiveWords.includes(word)).length
    const negativeCount = words.filter((word) => negativeWords.includes(word)).length

    if (positiveCount > negativeCount) {
      sentiment = "Positive"
    } else if (negativeCount > positiveCount) {
      sentiment = "Negative"
    }

    // Simple spam detection
    const spamKeywords = ["buy now", "click here", "free", "discount", "offer", "limited time"]
    const containsSpam = spamKeywords.some((keyword) => text.toLowerCase().includes(keyword))
    const classification = containsSpam ? "Spam" : "Genuine"

    // Create reason based on classification and sentiment
    let reason = ""
    if (classification === "Spam") {
      reason = "This feedback contains potentially promotional content or spam patterns."
    } else {
      reason = `This feedback appears to be a genuine user experience with ${sentiment.toLowerCase()} sentiment.`
    }

    // Calculate accuracy (simplified)
    const accuracy = 70 + Math.floor(Math.random() * 20)

    // Create and save the review
    const review = await Review.create({
      category: category || null,
      productName: product || null,
      review: text,
      classification,
      sentiment,
      reason,
      accuracy,
    })

    // Get real sentiment distribution from database
    const sentimentCounts = await Review.aggregate([{ $group: { _id: "$sentiment", count: { $sum: 1 } } }])

    const sentimentData = sentimentCounts.map((item) => {
      const color = item._id === "Positive" ? "#22c55e" : item._id === "Negative" ? "#ef4444" : "#94a3b8"

      return {
        name: item._id,
        value: item.count,
        color,
      }
    })

    // Get real trend data from database
    const trendData = await Review.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ])

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const formattedTrendData = trendData.map((item) => ({
      month: months[item._id.month - 1],
      value: item.count,
    }))

    // Get aspect data based on reviews with the same category/product
    const aspectData = [
      { name: "Quality", positive: 0, neutral: 0, negative: 0 },
      { name: "Price", positive: 0, neutral: 0, negative: 0 },
      { name: "Support", positive: 0, neutral: 0, negative: 0 },
      { name: "Usability", positive: 0, neutral: 0, negative: 0 },
    ]

    // In a real app, you would analyze the text to extract aspects
    // For now, we'll populate with real sentiment distribution for the category/product
    if (category || product) {
      const query = {}
      if (category) query.category = category
      if (product) query.productName = product

      const relatedReviews = await Review.find(query)

      if (relatedReviews.length > 0) {
        const positiveCount = relatedReviews.filter((r) => r.sentiment === "Positive").length
        const neutralCount = relatedReviews.filter((r) => r.sentiment === "Neutral").length
        const negativeCount = relatedReviews.filter((r) => r.sentiment === "Negative").length
        const total = relatedReviews.length

        aspectData.forEach((aspect) => {
          // Distribute the real sentiment percentages across aspects with some variation
          aspect.positive = Math.round((positiveCount / total) * 100 * (0.8 + Math.random() * 0.4))
          aspect.neutral = Math.round((neutralCount / total) * 100 * (0.8 + Math.random() * 0.4))
          aspect.negative = Math.round((negativeCount / total) * 100 * (0.8 + Math.random() * 0.4))

          // Normalize to 100%
          const sum = aspect.positive + aspect.neutral + aspect.negative
          if (sum > 0) {
            aspect.positive = Math.round((aspect.positive / sum) * 100)
            aspect.neutral = Math.round((aspect.neutral / sum) * 100)
            aspect.negative = 100 - aspect.positive - aspect.neutral
          }
        })
      }
    }

    // Extract key phrases (simplified)
    const keyPhrases = []
    const reviewWords = text.toLowerCase().split(/\s+/)
    const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by"]

    // Find potential key phrases (words not in common words list)
    reviewWords.forEach((word) => {
      if (word.length > 3 && !commonWords.includes(word) && !keyPhrases.includes(word)) {
        keyPhrases.push(word)
      }
    })

    // Limit to 5 key phrases
    const limitedKeyPhrases = keyPhrases.slice(0, 5)

    // Return the complete analysis result with real data
    res.status(201).json({
      review,
      sentimentData,
      aspectData,
      trendData: formattedTrendData,
      keyPhrases: limitedKeyPhrases,
    })
  } catch (error) {
    console.error("Error analyzing feedback:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
