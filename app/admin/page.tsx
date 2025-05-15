"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Convert raw score to IELTS band score
const calculateBandScore = (rawScore: number, totalQuestions: number): number => {
  // Return 0 if the raw score is 0
  if (rawScore === 0) return 0

  // IELTS approximate band score conversion
  const percentage = (rawScore / totalQuestions) * 100

  if (percentage >= 90) return 9.0
  if (percentage >= 85) return 8.5
  if (percentage >= 80) return 8.0
  if (percentage >= 75) return 7.5
  if (percentage >= 70) return 7.0
  if (percentage >= 65) return 6.5
  if (percentage >= 60) return 6.0
  if (percentage >= 55) return 5.5
  if (percentage >= 50) return 5.0
  if (percentage >= 45) return 4.5
  if (percentage >= 40) return 4.0
  if (percentage >= 35) return 3.5
  if (percentage >= 30) return 3.0
  if (percentage >= 25) return 2.5

  return 2.0 // Minimum band score (unless score is 0)
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [testResults, setTestResults] = useState<any[]>([])
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [readingScore, setReadingScore] = useState<string>("0")
  const [listeningScore, setListeningScore] = useState<string>("0")
  const [writingBand, setWritingBand] = useState<string>("0")
  const [overallBand, setOverallBand] = useState<string>("0")
  const [telegramToken, setTelegramToken] = useState<string>("8115894799:AAGckh-QqdWre1Bkfq6l8FrQcNqmVPgLJV4")
  const [chatId, setChatId] = useState<string>("-4196325308")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [scoreError, setScoreError] = useState<string>("")

  useEffect(() => {
    // Check if user is admin
    const user = sessionStorage.getItem("currentUser")
    if (user !== "superadmin8071") {
      router.push("/")
      return
    }

    setIsAdmin(true)

    // Load test results
    try {
      const results = JSON.parse(localStorage.getItem("testResults") || "[]")
      setTestResults(results)
    } catch (err) {
      console.error("Error loading test results:", err)
      setTestResults([])
    }

    setIsLoading(false)
  }, [router])

  const handleSelectTest = (test: any) => {
    setSelectedTest(test)
    setReadingScore(test.readingScore?.toString() || "0")
    setListeningScore(test.listeningScore?.toString() || "0")
    setWritingBand(test.writingBand?.toString() || "0")

    // Calculate overall band
    const readingBand = test.readingBand || 0
    const listeningBand = test.listeningBand || 0
    const writingBandValue = test.writingBand || 0
    const overall = ((readingBand + listeningBand + writingBandValue) / 3).toFixed(1)
    setOverallBand(overall)
  }

  const validateScore = (value: string, max: number): boolean => {
    const score = Number.parseInt(value)
    if (isNaN(score) || score < 0 || score > max) {
      setScoreError(`Score must be between 0 and ${max}`)
      return false
    }
    setScoreError("")
    return true
  }

  const handleReadingScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setReadingScore(value)

    if (value && validateScore(value, 40)) {
      const score = Number.parseInt(value)
      const band = calculateBandScore(score, 40)

      // Calculate new overall band
      const listeningBand = calculateBandScore(Number.parseInt(listeningScore) || 0, 40)
      const writingBandValue = Number.parseFloat(writingBand) || 0
      const overall = ((band + listeningBand + writingBandValue) / 3).toFixed(1)
      setOverallBand(overall)
    }
  }

  const handleListeningScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setListeningScore(value)

    if (value && validateScore(value, 40)) {
      const score = Number.parseInt(value)
      const band = calculateBandScore(score, 40)

      // Calculate new overall band
      const readingBand = calculateBandScore(Number.parseInt(readingScore) || 0, 40)
      const writingBandValue = Number.parseFloat(writingBand) || 0
      const overall = ((readingBand + band + writingBandValue) / 3).toFixed(1)
      setOverallBand(overall)
    }
  }

  const handleWritingBandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWritingBand(value)

    if (value && !isNaN(Number.parseFloat(value)) && Number.parseFloat(value) >= 0 && Number.parseFloat(value) <= 9) {
      const band = Number.parseFloat(value)

      // Calculate new overall band
      const readingBand = calculateBandScore(Number.parseInt(readingScore) || 0, 40)
      const listeningBand = calculateBandScore(Number.parseInt(listeningScore) || 0, 40)
      const overall = ((readingBand + listeningBand + band) / 3).toFixed(1)
      setOverallBand(overall)
    }
  }

  const handleUpdateScores = () => {
    if (!selectedTest) return

    // Validate scores
    if (!validateScore(readingScore, 40) || !validateScore(listeningScore, 40)) {
      return
    }

    // Validate writing band
    const writingBandValue = Number.parseFloat(writingBand)
    if (isNaN(writingBandValue) || writingBandValue < 0 || writingBandValue > 9) {
      setScoreError("Writing band score must be between 0 and 9")
      return
    }

    // Update the selected test
    const updatedTest = {
      ...selectedTest,
      readingScore: Number.parseInt(readingScore),
      readingBand: calculateBandScore(Number.parseInt(readingScore), 40),
      listeningScore: Number.parseInt(listeningScore),
      listeningBand: calculateBandScore(Number.parseInt(listeningScore), 40),
      writingBand: writingBandValue,
      overallBand: Number.parseFloat(overallBand),
      scored: true,
      scoredAt: new Date().toLocaleString(),
    }

    // Update the test results array
    const updatedResults = testResults.map((test) => (test.timestamp === selectedTest.timestamp ? updatedTest : test))

    // Save to localStorage
    localStorage.setItem("testResults", JSON.stringify(updatedResults))
    setTestResults(updatedResults)
    setSelectedTest(updatedTest)

    // Send results to Telegram
    sendResultsToTelegram(updatedTest)
      .then(() => {
        setSuccess("Scores updated and sent successfully!")
        setTimeout(() => setSuccess(""), 3000)
      })
      .catch((err) => {
        console.error("Error sending results:", err)
        setError("Scores updated but failed to send notification")
        setTimeout(() => setError(""), 5000)
      })
  }

  const sendResultsToTelegram = async (test: any) => {
    const message = `
📊 *IELTS Test Results - SCORED*

👤 *Student*: ${test.student}

📚 *Reading*: ${test.readingScore}/40 - Band ${test.readingBand.toFixed(1)}
🎧 *Listening*: ${test.listeningScore}/40 - Band ${test.listeningBand.toFixed(1)}
✍️ *Writing*: Band ${test.writingBand.toFixed(1)}

🌟 *Overall Band Score*: ${test.overallBand.toFixed(1)}

⏰ *Scored at*: ${test.scoredAt}
    `

    const response = await fetch("/api/send-telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        token: telegramToken,
        chatId: chatId,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send results to Telegram")
    }

    return response.json()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>You do not have permission to access this page.</AlertDescription>
            </Alert>
            <Button className="w-full mt-4" onClick={() => router.push("/")}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="tests">
        <TabsList className="mb-4">
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Test Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.length === 0 ? (
                    <p className="text-gray-500">No test results available.</p>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {testResults.map((test, index) => (
                        <Button
                          key={index}
                          variant={selectedTest?.timestamp === test.timestamp ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => handleSelectTest(test)}
                        >
                          <div>
                            <div className="font-medium">{test.student}</div>
                            <div className="text-sm text-gray-500">{new Date(test.timestamp).toLocaleString()}</div>
                            <div className="text-xs mt-1">
                              {test.scored ? (
                                <span className="text-green-500">Scored: {test.overallBand?.toFixed(1)}</span>
                              ) : (
                                <span className="text-yellow-500">Not scored</span>
                              )}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {selectedTest ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Test Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Student: {selectedTest.student}</h3>
                          <p className="text-sm text-gray-500">
                            Completed: {new Date(selectedTest.timestamp).toLocaleString()}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Reading</h4>
                            <p>
                              Questions Answered:{" "}
                              {selectedTest.readingAnswers?.filter((a: string) => a?.trim()).length || 0}/40
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Listening</h4>
                            <p>
                              Questions Answered:{" "}
                              {selectedTest.listeningAnswers?.filter((a: string) => a?.trim()).length || 0}/40
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Writing Task 1</h4>
                          <p className="text-sm mb-1">Word Count: {selectedTest.writingTask1Words || 0} words</p>
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded max-h-40 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">
                              {selectedTest.writingTask1 || "No response provided"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Writing Task 2</h4>
                          <p className="text-sm mb-1">Word Count: {selectedTest.writingTask2Words || 0} words</p>
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded max-h-40 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">
                              {selectedTest.writingTask2 || "No response provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Score and Rate Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {scoreError && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{scoreError}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert className="mb-4 bg-green-100 dark:bg-green-900 border-green-500">
                          <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
                        </Alert>
                      )}
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="reading-score">Reading Score (out of 40)</Label>
                          <Input
                            id="reading-score"
                            type="number"
                            min="0"
                            max="40"
                            value={readingScore}
                            onChange={handleReadingScoreChange}
                            placeholder="0"
                            className="mt-1"
                          />
                          <p className="text-sm mt-1">
                            Band: {calculateBandScore(Number.parseInt(readingScore) || 0, 40).toFixed(1)}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="listening-score">Listening Score (out of 40)</Label>
                          <Input
                            id="listening-score"
                            type="number"
                            min="0"
                            max="40"
                            value={listeningScore}
                            onChange={handleListeningScoreChange}
                            placeholder="0"
                            className="mt-1"
                          />
                          <p className="text-sm mt-1">
                            Band: {calculateBandScore(Number.parseInt(listeningScore) || 0, 40).toFixed(1)}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="writing-band">Writing Band Score (out of 9.0)</Label>
                          <Input
                            id="writing-band"
                            type="number"
                            min="0"
                            max="9"
                            step="0.5"
                            value={writingBand}
                            onChange={handleWritingBandChange}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="overall-band">Overall Band Score</Label>
                          <Input
                            id="overall-band"
                            type="text"
                            value={overallBand}
                            readOnly
                            className="mt-1 bg-gray-100 dark:bg-gray-800"
                          />
                        </div>
                      </div>

                      <Button onClick={handleUpdateScores} className="mt-6 w-full">
                        Update Scores
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-center">Select a test to view details and score it.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Telegram Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="telegram-token">Telegram Bot Token</Label>
                  <Input
                    id="telegram-token"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="chat-id">Chat ID</Label>
                  <Input id="chat-id" value={chatId} onChange={(e) => setChatId(e.target.value)} className="mt-1" />
                </div>

                <Button
                  onClick={() => {
                    localStorage.setItem("telegramToken", telegramToken)
                    localStorage.setItem("telegramChatId", chatId)
                    setSuccess("Telegram settings saved successfully!")
                    setTimeout(() => setSuccess(""), 3000)
                  }}
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
