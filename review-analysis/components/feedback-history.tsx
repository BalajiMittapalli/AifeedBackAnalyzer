"use client"

import { useEffect, useState } from "react"
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Search, Clock, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Review } from "@/types/review"
import { formatDistanceToNow } from "date-fns"

// Type for recent searches
interface RecentSearch {
  id: string
  text: string
  category?: string
  product?: string
  timestamp: number
}

export default function FeedbackHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [product, setProduct] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const router = useRouter()

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("submittedFeedback")
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches)
        setRecentSearches(parsedSearches)
      } catch (e) {
        console.error("Error parsing saved searches:", e)
      }
    }
  }, [])

  // Save a new search to recent searches
  const saveSearch = (text: string, category?: string, product?: string) => {
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      text,
      category,
      product,
      timestamp: Date.now(),
    }

    // Add to beginning, limit to 5 recent searches
    const updatedSearches = [newSearch, ...recentSearches.filter((s) => s.text !== text)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem("submittedFeedback", JSON.stringify(updatedSearches))
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    try {
      setLoading(true)
      setHasSearched(true)
      const response = await axios.get("http://localhost:2000/api/reviews/")

      // Filter reviews based on search criteria
      const filteredReviews = response.data.filter((review: Review) => {
        const matchesText = review.review.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !category || review.category.toLowerCase().includes(category.toLowerCase())
        const matchesProduct = !product || review.productName.toLowerCase().includes(product.toLowerCase())
        return matchesText && matchesCategory && matchesProduct
      })

      setReviews(filteredReviews)
      saveSearch(searchTerm, category || undefined, product || undefined)

      if (filteredReviews.length === 0) {
        setError("No matching feedback found")
      } else {
        setError("")
      }
    } catch (err) {
      console.error("Error searching feedback:", err)
      setError("Failed to search feedback. Please check if the API server is running.")
    } finally {
      setLoading(false)
    }
  }

  // Navigate to analysis page with the selected review
  const goToAnalysis = (review: Review) => {
    router.push(
      `/analysis?feedback=${encodeURIComponent(review.review)}&category=${encodeURIComponent(review.category)}&product=${encodeURIComponent(review.productName)}`,
    )
  }

  // Load a recent search
  const loadRecentSearch = (search: RecentSearch) => {
    setSearchTerm(search.text)
    setCategory(search.category || "")
    setProduct(search.product || "")

    // Automatically search after setting the values
    setTimeout(() => {
      handleSearch()
    }, 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-zinc-900 rounded-lg p-6"
    >
      <div className="flex items-center mb-4">
        <MessageSquare className="mr-2 h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold">Feedback History</h2>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search feedback by text..."
            className="bg-zinc-800 border-zinc-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading || !searchTerm.trim()}>
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </div>

      {/* Recent Searches Section */}
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-400">Previously Submitted Feedback</h3>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search) => (
              <motion.div
                key={search.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => loadRecentSearch(search)}
                className="p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-md cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-200 mb-1">{search.text}</p>
                  <div className="flex gap-2">
                    {search.category && (
                      <Badge variant="outline" className="bg-zinc-700/30 text-zinc-400 text-xs">
                        {search.category}
                      </Badge>
                    )}
                    {search.product && (
                      <Badge variant="outline" className="bg-zinc-700/30 text-zinc-400 text-xs">
                        {search.product}
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(search.timestamp), { addSuffix: true })}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <p className="text-red-400 text-center py-4">{error}</p>
      ) : !hasSearched ? (
        <p className="text-center text-gray-400 py-4">Search for feedback to see results</p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={() => goToAnalysis(review)}
              className="p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700/80 transition-colors group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-zinc-700/50 text-zinc-300">
                    {review.category}
                  </Badge>
                  {review.productName && (
                    <Badge variant="outline" className="bg-zinc-700/50 text-zinc-300">
                      {review.productName}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex items-center">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <p className="text-gray-200 mb-3">{review.review}</p>

              <div className="flex justify-end">
                <SentimentBadge sentiment={review.sentiment} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
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
