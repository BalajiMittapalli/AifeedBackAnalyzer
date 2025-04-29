"use client"

import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react"

interface SentimentChartProps {
  positive: number
  neutral: number
  negative: number
}

export default function SentimentChart({ positive, neutral, negative }: SentimentChartProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <ThumbsUp className="w-5 h-5 text-green-500 mr-2" />
        <span className="text-sm mr-2">Positive</span>
        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${positive}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-green-500 h-full rounded-full"
          />
        </div>
        <span className="ml-2 text-sm">{positive}%</span>
      </div>

      <div className="flex items-center">
        <Minus className="w-5 h-5 text-gray-500 mr-2" />
        <span className="text-sm mr-2">Neutral</span>
        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${neutral}%` }}
            transition={{ duration: 1, delay: 0.7 }}
            className="bg-gray-500 h-full rounded-full"
          />
        </div>
        <span className="ml-2 text-sm">{neutral}%</span>
      </div>

      <div className="flex items-center">
        <ThumbsDown className="w-5 h-5 text-red-500 mr-2" />
        <span className="text-sm mr-2">Negative</span>
        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${negative}%` }}
            transition={{ duration: 1, delay: 0.9 }}
            className="bg-red-500 h-full rounded-full"
          />
        </div>
        <span className="ml-2 text-sm">{negative}%</span>
      </div>
    </div>
  )
}
