"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, BarChart3, CheckCircle, MessageSquare, ThumbsDown, ThumbsUp, Minus } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Review } from "@/types/review"

export default function AnalysisPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [matchedReview, setMatchedReview] = useState<Review | null>(null)

  const feedbackText = searchParams.get("feedback") || ""
  const category = searchParams.get("category") || ""
  const product = searchParams.get("product") || ""

  useEffect(() => {
    if (!feedbackText) {
      router.push("/")
      return
    }

    const findSimilarReview = async () => {
      try {
        setLoading(true)
        // In a real app, you would send the feedback to your API for analysis
        const response = await axios.get("http://localhost:2000/api/reviews/")
        const reviews = response.data as Review[]

        if (reviews.length > 0) {
          // Find the most similar review based on text similarity
          // This is a simple implementation - in a real app, you would use NLP or your API's matching logic
          let bestMatch: Review | null = null
          let highestSimilarity = -1

          const userFeedbackLower = feedbackText.toLowerCase()

          for (const review of reviews) {
            // Calculate simple similarity score based on word overlap
            const reviewLower = review.review.toLowerCase()

            // Split into words and count matching words
            const userWords = userFeedbackLower.split(/\s+/)
            const reviewWords = reviewLower.split(/\s+/)

            let matchCount = 0
            for (const word of userWords) {
              if (word.length > 2 && reviewWords.includes(word)) {
                // Only count words with length > 2
                matchCount++
              }
            }

            // Calculate similarity as percentage of matching words
            const similarity = userWords.length > 0 ? matchCount / userWords.length : 0

            if (similarity > highestSimilarity) {
              highestSimilarity = similarity
              bestMatch = review
            }
          }

          // If we couldn't find a good match, use the first review as fallback
          setMatchedReview(bestMatch || reviews[0])
        } else {
          setError("No reviews found to analyze against")
        }
      } catch (err) {
        console.error("Error analyzing feedback:", err)
        setError("Failed to analyze feedback. Please check if the API server is running.")
      } finally {
        setLoading(false)
      }
    }

    findSimilarReview()
  }, [feedbackText, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !matchedReview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
        <div className="text-red-500 text-xl mb-4">Error</div>
        <p className="text-center text-white">{error || "No feedback analysis available"}</p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-6"
      >
        <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Feedback Analysis</h1>
      </motion.div>

      <div className="grid gap-6">
        {/* Feedback Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Your Feedback</h2>
          </div>
          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-gray-200">{feedbackText}</p>
            {(category || product) && (
              <div className="flex gap-2 mt-3">
                {category && (
                  <Badge variant="outline" className="bg-zinc-700/50 text-zinc-300">
                    {category}
                  </Badge>
                )}
                {product && (
                  <Badge variant="outline" className="bg-zinc-700/50 text-zinc-300">
                    {product}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Classification Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-zinc-900 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Classification Results</h2>
          </div>

          <div className="mb-4">
            <span className="text-gray-400 mr-2">Feedback Type:</span>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
              {matchedReview.classification}
            </Badge>
          </div>

          

          <div className="mt-4 text-right">
            <span className="text-gray-400">Accuracy: </span>
            <span className="text-white font-semibold">{matchedReview.accuracy}%</span>
          </div>
        </motion.div>

        {/* Sentiment Analysis */}
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

          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium">Feedback Sentiment</h3>
              <p className="text-sm text-gray-400">Based on our analysis of your feedback</p>
            </div>
            <SentimentBadge sentiment={matchedReview.sentiment} />
          </div>

          <div className="p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center mb-4">
              <SentimentIcon sentiment={matchedReview.sentiment} className="mr-3 h-8 w-8" />
              <div>
                <h4 className="font-medium">{getSentimentTitle(matchedReview.sentiment)}</h4>
                <p className="text-sm text-gray-400">{getSentimentDescription(matchedReview.sentiment)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  switch (sentiment) {
    case "Positive":
      return (
        <Badge variant="outline" className="bg-green-900/20 text-green-400">
          <ThumbsUp className="mr-1 h-3 w-3" /> Positive
        </Badge>
      )
    case "Negative":
      return (
        <Badge variant="outline" className="bg-red-900/20 text-red-400">
          <ThumbsDown className="mr-1 h-3 w-3" /> Negative
        </Badge>
      )
    case "Neutral":
      return (
        <Badge variant="outline" className="bg-gray-700/20 text-gray-400">
          <Minus className="mr-1 h-3 w-3" /> Neutral
        </Badge>
      )
    default:
      return null
  }
}

function SentimentIcon({ sentiment, className }: { sentiment: string; className?: string }) {
  switch (sentiment) {
    case "Positive":
      return <ThumbsUp className={`text-green-400 ${className}`} />
    case "Negative":
      return <ThumbsDown className={`text-red-400 ${className}`} />
    case "Neutral":
      return <Minus className={`text-gray-400 ${className}`} />
    default:
      return null
  }
}

function getSentimentTitle(sentiment: string): string {
  switch (sentiment) {
    case "Positive":
      return "Positive Feedback"
    case "Negative":
      return "Negative Feedback"
    case "Neutral":
      return "Neutral Feedback"
    default:
      return "Unknown Sentiment"
  }
}

function getSentimentDescription(sentiment: string): string {
  switch (sentiment) {
    case "Positive":
      return "Your feedback indicates a positive experience with our product or service."
    case "Negative":
      return "Your feedback indicates areas where we need to improve."
    case "Neutral":
      return "Your feedback is balanced with both positive and negative aspects."
    default:
      return "We couldn't determine the sentiment of your feedback."
  }
}
