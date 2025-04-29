"use client"

import { motion } from "framer-motion"
import type { Review } from "@/types/review"

interface ReviewCardProps {
  review: Review
  isSelected: boolean
  onClick: () => void
}

export default function ReviewCard({ review, isSelected, onClick }: ReviewCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-800/50 hover:bg-zinc-800"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-white">{review.productName}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300">{review.category}</span>
      </div>
      <p className="text-gray-300 text-sm mb-2">{review.review}</p>
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Accuracy: {review.accuracy}%</span>
        <SentimentIndicator sentiment={review.sentiment} />
      </div>
    </motion.div>
  )
}

function SentimentIndicator({ sentiment }: { sentiment: string }) {
  let bgColor = "bg-gray-600"
  let textColor = "text-gray-300"

  if (sentiment === "Positive") {
    bgColor = "bg-green-900/50"
    textColor = "text-green-400"
  } else if (sentiment === "Negative") {
    bgColor = "bg-red-900/50"
    textColor = "text-red-400"
  } else if (sentiment === "Neutral") {
    bgColor = "bg-gray-700"
    textColor = "text-gray-300"
  }

  return <span className={`px-2 py-1 rounded-full ${bgColor} ${textColor}`}>{sentiment}</span>
}
