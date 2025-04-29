"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, BarChart2, PieChart, Filter } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import type { Review } from "@/types/review"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Pie } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

export default function VisualizationPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [products, setProducts] = useState<string[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:2000/api/reviews/")
        const reviewData = response.data as Review[]
        setReviews(reviewData)

        // Extract unique categories and products
        const uniqueCategories = Array.from(new Set(reviewData.map((review) => review.category)))
        const uniqueProducts = Array.from(new Set(reviewData.map((review) => review.productName)))

        setCategories(uniqueCategories)
        setProducts(uniqueProducts)
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setError("Failed to fetch review data. Please check if the API server is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Filter reviews based on selected category and product
  const filteredReviews = reviews.filter((review) => {
    const matchesCategory = selectedCategory === "all" || review.category === selectedCategory
    const matchesProduct = selectedProduct === "all" || review.productName === selectedProduct
    return matchesCategory && matchesProduct
  })

  // Calculate sentiment counts
  const sentimentCounts = filteredReviews.reduce(
    (acc, review) => {
      acc[review.sentiment] = (acc[review.sentiment] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalReviews = filteredReviews.length
  const positiveCount = sentimentCounts["Positive"] || 0
  const neutralCount = sentimentCounts["Neutral"] || 0
  const negativeCount = sentimentCounts["Negative"] || 0

  const positivePercentage = totalReviews ? Math.round((positiveCount / totalReviews) * 100) : 0
  const neutralPercentage = totalReviews ? Math.round((neutralCount / totalReviews) * 100) : 0
  const negativePercentage = totalReviews ? Math.round((negativeCount / totalReviews) * 100) : 0

  // Calculate category-based sentiment
  const categorySentiment = categories.map((category) => {
    const categoryReviews = reviews.filter((review) => review.category === category)
    const total = categoryReviews.length
    const positive = categoryReviews.filter((review) => review.sentiment === "Positive").length
    const neutral = categoryReviews.filter((review) => review.sentiment === "Neutral").length
    const negative = categoryReviews.filter((review) => review.sentiment === "Negative").length

    return {
      category,
      total,
      positive: total ? Math.round((positive / total) * 100) : 0,
      neutral: total ? Math.round((neutral / total) * 100) : 0,
      negative: total ? Math.round((negative / total) * 100) : 0,
    }
  })

  // Calculate product-based sentiment
  const productSentiment = products.map((product) => {
    const productReviews = reviews.filter((review) => review.productName === product)
    const total = productReviews.length
    const positive = productReviews.filter((review) => review.sentiment === "Positive").length
    const neutral = productReviews.filter((review) => review.sentiment === "Neutral").length
    const negative = productReviews.filter((review) => review.sentiment === "Negative").length

    return {
      product,
      total,
      positive: total ? Math.round((positive / total) * 100) : 0,
      neutral: total ? Math.round((neutral / total) * 100) : 0,
      negative: total ? Math.round((negative / total) * 100) : 0,
    }
  })

  // Calculate average accuracy
  const averageAccuracy = totalReviews
    ? Math.round(filteredReviews.reduce((sum, review) => sum + review.accuracy, 0) / totalReviews)
    : 0

  // Chart data for overall sentiment
  const sentimentPieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [positiveCount, neutralCount, negativeCount],
        backgroundColor: ["rgba(75, 192, 75, 0.6)", "rgba(150, 150, 150, 0.6)", "rgba(255, 99, 99, 0.6)"],
        borderColor: ["rgba(75, 192, 75, 1)", "rgba(150, 150, 150, 1)", "rgba(255, 99, 99, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Chart data for category sentiment
  const categorySentimentData = {
    labels: categorySentiment.map((item) => item.category),
    datasets: [
      {
        label: "Positive",
        data: categorySentiment.map((item) => item.positive),
        backgroundColor: "rgba(75, 192, 75, 0.6)",
      },
      {
        label: "Neutral",
        data: categorySentiment.map((item) => item.neutral),
        backgroundColor: "rgba(150, 150, 150, 0.6)",
      },
      {
        label: "Negative",
        data: categorySentiment.map((item) => item.negative),
        backgroundColor: "rgba(255, 99, 99, 0.6)",
      },
    ],
  }

  // Chart data for product sentiment
  const productSentimentData = {
    labels: productSentiment.map((item) => item.product),
    datasets: [
      {
        label: "Positive",
        data: productSentiment.map((item) => item.positive),
        backgroundColor: "rgba(75, 192, 75, 0.6)",
      },
      {
        label: "Neutral",
        data: productSentiment.map((item) => item.neutral),
        backgroundColor: "rgba(150, 150, 150, 0.6)",
      },
      {
        label: "Negative",
        data: productSentiment.map((item) => item.negative),
        backgroundColor: "rgba(255, 99, 99, 0.6)",
      },
    ],
  }

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sentiment Distribution (%)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
        <div className="text-red-500 text-xl mb-4">Error</div>
        <p className="text-center text-white">{error}</p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Feedback Visualization</h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-zinc-900 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center mb-6">
          <Filter className="mr-2 h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Filter Data</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400">Positive</CardTitle>
              <CardDescription>Percentage of positive feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{positivePercentage}%</div>
              <div className="text-sm text-gray-400 mt-1">{positiveCount} reviews</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400">Neutral</CardTitle>
              <CardDescription>Percentage of neutral feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{neutralPercentage}%</div>
              <div className="text-sm text-gray-400 mt-1">{neutralCount} reviews</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-400">Negative</CardTitle>
              <CardDescription>Percentage of negative feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{negativePercentage}%</div>
              <div className="text-sm text-gray-400 mt-1">{negativeCount} reviews</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="bg-zinc-800 border-zinc-700 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="product">By Product</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-400" />
                  Overall Sentiment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <Pie data={sentimentPieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
                  Analysis Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Average Accuracy</h3>
                    <div className="w-full bg-zinc-800 rounded-full h-4">
                      <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${averageAccuracy}%` }}></div>
                    </div>
                    <div className="text-right mt-1 text-sm">{averageAccuracy}%</div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Total Reviews</h3>
                    <div className="text-3xl font-bold">{totalReviews}</div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Sentiment Ratio</h3>
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div className="bg-green-500" style={{ width: `${positivePercentage}%` }}></div>
                      <div className="bg-gray-500" style={{ width: `${neutralPercentage}%` }}></div>
                      <div className="bg-red-500" style={{ width: `${negativePercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-green-400">{positivePercentage}% Positive</span>
                      <span className="text-gray-400">{neutralPercentage}% Neutral</span>
                      <span className="text-red-400">{negativePercentage}% Negative</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="category">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
                  Sentiment by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar data={categorySentimentData} options={barOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="product">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-400" />
                  Sentiment by Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar data={productSentimentData} options={barOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
