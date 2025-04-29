"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Send, Tag, Package, BarChart2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import FeedbackHistory from "@/components/feedback-history"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState("")
  const [category, setCategory] = useState("")
  const [product, setProduct] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // This would normally save to your database, but for this demo
  // we'll just navigate to the analysis page with the feedback text
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!feedback.trim()) return;
  
    setIsSubmitting(true);
  
    try {
      // Create the request body
      const requestBody = {
        review: feedback,
        productName: product || undefined,
        category: category || undefined,
      };
  
      // Send POST request to your FastAPI backend
      const response = await fetch("http://0.0.0.0:8000/process-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
  
      const result = await response.json();
      console.log("Backend response:", result);
  
      // Save to localStorage for history
      const newFeedback = {
        id: Date.now().toString(),
        text: feedback,
        category: category || undefined,
        product: product || undefined,
        timestamp: Date.now(),
      };
  
      const existingFeedback = localStorage.getItem("submittedFeedback");
      let feedbackHistory = existingFeedback ? JSON.parse(existingFeedback) : [];
  
      feedbackHistory = [newFeedback, ...feedbackHistory.filter((item) => item.text !== feedback)].slice(0, 5);
      localStorage.setItem("submittedFeedback", JSON.stringify(feedbackHistory));
  
      // Navigate to analysis page with query params
      router.push(
        `/analysis?feedback=${encodeURIComponent(feedback)}&category=${encodeURIComponent(category)}&product=${encodeURIComponent(product)}`
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 pt-8"
      >
        <h1 className="text-3xl font-bold mb-4">Feedback Analysis & Visualization</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Share your thoughts and experiences with us. Our AI-powered system analyzes your feedback to provide insights
          and help us improve our products and services. Your opinion matters!
        </p>
      </motion.div>

      <div className="flex justify-end mb-4">
        <Link href="/visualization">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            View Visualization Reports
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-zinc-900 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center mb-4">
          <MessageSquare className="mr-2 h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Submit Your Feedback</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium mb-2">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts, suggestions, or experiences with us..."
              className="min-h-[120px] bg-zinc-800 border-zinc-700"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="flex items-center text-sm font-medium mb-2">
                <Tag className="h-4 w-4 mr-1" /> Category (Optional)
              </label>
              <Input
                id="category"
                placeholder="e.g.,Phone,Mobile,Car"
                className="bg-zinc-800 border-zinc-700"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="product" className="flex items-center text-sm font-medium mb-2">
                <Package className="h-4 w-4 mr-1" /> Product (Optional)
              </label>
              <Input
                id="product"
                placeholder="e.g., Iphone 13,Swift desire"
                className="bg-zinc-800 border-zinc-700"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isSubmitting || !feedback.trim()}
          >
            <Send className="h-4 w-4 mr-2" /> Submit Feedback
          </Button>
        </form>
      </motion.div>

      <FeedbackHistory />
    </div>
  )
}
