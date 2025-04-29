"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ArrowLeft, BarChart3, CheckCircle, MessageSquare, ThumbsDown, ThumbsUp, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import ReviewCard from "@/components/review-card"
import SentimentChart from "@/components/sentiment-chart"
import type { Review } from "@/types/review"

export default function ReviewDashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  // Calculate sentiment percentages
  const sentimentCounts = reviews.reduce(
    (acc, review) => {
      acc[review.sentiment] = (acc[review.sentiment] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalReviews = reviews.length
  const positivePercentage = totalReviews ? Math.round(((sentimentCounts["Positive"] || 0) / totalReviews) * 100) : 0
  const neutralPercentage = totalReviews ? Math.round(((sentimentCounts["Neutral"] || 0) / totalReviews) * 100) : 0
  const negativePercentage = totalReviews ? Math.round(((sentimentCounts["Negative"] || 0) / totalReviews) * 100) : 0

  // Determine overall sentiment
  const getOverallSentiment = () => {
    if (positivePercentage > neutralPercentage && positivePercentage > negativePercentage) return "Positive"
    if (negativePercentage > neutralPercentage && negativePercentage > positivePercentage) return "Negative"
    if (neutralPercentage > positivePercentage && neutralPercentage > negativePercentage) return "Neutral"
    return "Neutral" // Default if equal
  }

  const overallSentiment = getOverallSentiment()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:2000/api/reviews/")
        setReviews(response.data)
        if (response.data.length > 0) {
          setSelectedReview(response.data[0])
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setError("Failed to fetch reviews. Please check if the API server is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-xl mb-4">Error</div>
        <p className="text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-6"
      >
        <button className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Feedback Analysis</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel - Review Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Your Feedback</h2>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                isSelected={selectedReview?._id === review._id}
                onClick={() => setSelectedReview(review)}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Classification Results */}
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Classification Results</h2>
              </div>

              <div className="mb-4">
                <span className="text-gray-400 mr-2">Feedback Type:</span>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                  {selectedReview.classification}
                </Badge>
              </div>

              
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-zinc-900 rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <BarChart3 className="mr-2 h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold">Sentiment Analysis</h2>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Overall Sentiment</h3>
                    <p className="text-sm text-gray-400">Based on our analysis of all feedback</p>
                  </div>
                  <SentimentBadge sentiment={overallSentiment} />
                </div>
              </div>

              <SentimentChart positive={positivePercentage} neutral={neutralPercentage} negative={negativePercentage} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  switch (sentiment) {
    case "Positive":
      return (
        <Badge variant="outline" className="bg-green-900/20 text-green-400 hover:bg-green-900/30">
          <ThumbsUp className="mr-1 h-3 w-3" /> Positive
        </Badge>
      )
    case "Negative":
      return (
        <Badge variant="outline" className="bg-red-900/20 text-red-400 hover:bg-red-900/30">
          <ThumbsDown className="mr-1 h-3 w-3" /> Negative
        </Badge>
      )
    case "Neutral":
      return (
        <Badge variant="outline" className="bg-gray-700/20 text-gray-400 hover:bg-gray-700/30">
          <Minus className="mr-1 h-3 w-3" /> Neutral
        </Badge>
      )
    default:
      return null
  }
}
