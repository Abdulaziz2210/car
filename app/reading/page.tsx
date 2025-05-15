"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { TextAnnotator } from "@/components/text-annotator"
import { TextAnnotationTools } from "@/components/text-annotation-tools"

export default function ReadingTest() {
  const router = useRouter()
  const [currentPassage, setCurrentPassage] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isStarted, setIsStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [annotations, setAnnotations] = useState<any[]>([])
  const [currentTool, setCurrentTool] = useState<string | null>(null)

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Handle time's up
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isStarted])

  useEffect(() => {
    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem("readingAnswers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }

    // Load saved annotations from localStorage
    const savedAnnotations = localStorage.getItem("readingAnnotations")
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations))
    }

    // Check if test was already started
    const testStarted = localStorage.getItem("readingTestStarted")
    if (testStarted === "true") {
      setIsStarted(true)
    }

    // Load current passage
    const savedPassage = localStorage.getItem("currentReadingPassage")
    if (savedPassage) {
      setCurrentPassage(Number.parseInt(savedPassage))
    }
  }, [])

  useEffect(() => {
    // Save current passage to localStorage
    localStorage.setItem("currentReadingPassage", currentPassage.toString())
  }, [currentPassage])

  useEffect(() => {
    // Save answers to localStorage
    localStorage.setItem("readingAnswers", JSON.stringify(answers))
  }, [answers])

  useEffect(() => {
    // Save annotations to localStorage
    localStorage.setItem("readingAnnotations", JSON.stringify(annotations))
  }, [annotations])

  useEffect(() => {
    // Save test started status to localStorage
    localStorage.setItem("readingTestStarted", isStarted.toString())
  }, [isStarted])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTest = () => {
    setIsStarted(true)
  }

  const handleNextPassage = () => {
    if (currentPassage < 3) {
      setCurrentPassage(currentPassage + 1)
    } else {
      // Navigate to the next section (Writing)
      localStorage.setItem("currentSection", "writing")
      router.push("/writing/task1")
    }
  }

  const handlePreviousPassage = () => {
    if (currentPassage > 1) {
      setCurrentPassage(currentPassage - 1)
    }
  }

  const handleFinishTest = () => {
    // Navigate to the next section (Writing)
    localStorage.setItem("currentSection", "writing")
    router.push("/writing/task1")
  }

  const handleAnnotation = (annotation: any) => {
    setAnnotations((prev) => [...prev, annotation])
  }

  const handleCircleClick = () => {
    setCurrentTool(currentTool === "circle" ? null : "circle")
  }

  const handleUnderlineClick = () => {
    setCurrentTool(currentTool === "underline" ? null : "underline")
  }

  const handleUndoAnnotation = () => {
    setAnnotations((prev) => prev.slice(0, -1))
  }

  // Reading passages content
  const passages = [
    {
      title: "Passage 1",
      content: `This is the content of Reading Passage 1. In the actual test, this would be a longer text of around 900 words.

The passage would typically be an authentic text on an academic subject of general interest, taken from a book, journal, magazine, or newspaper.

You should read this passage carefully and answer the questions that follow.`,
      questions: [
        {
          id: "rq1",
          type: "truefalse",
          question: "1. The author suggests that the topic of the passage is well-researched.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq2",
          type: "truefalse",
          question: "2. According to the passage, the findings are conclusive.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq3",
          type: "truefalse",
          question: "3. The research mentioned in the passage was conducted over a period of five years.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq4",
          type: "truefalse",
          question: "4. The author believes that further research is necessary.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
        },
        {
          id: "rq5",
          type: "shortanswer",
          question: "5. What was the main focus of the research described in the passage?",
        },
        {
          id: "rq6",
          type: "shortanswer",
          question: "6. Who funded the research project?",
        },
        {
          id: "rq7",
          type: "shortanswer",
          question: "7. In which year was the initial study conducted?",
        },
        {
          id: "rq8",
          type: "shortanswer",
          question: "8. What method was used to collect the data?",
        },
        {
          id: "rq9",
          type: "multiplechoice",
          question: "9. Which of the following best describes the author's attitude toward the research?",
          options: ["A. Enthusiastic", "B. Skeptical", "C. Neutral", "D. Critical"],
        },
        {
          id: "rq10",
          type: "multiplechoice",
          question: "10. According to the passage, what was the most significant finding of the research?",
          options: [
            "A. The correlation between variables X and Y",
            "B. The lack of evidence for the initial hypothesis",
            "C. The unexpected relationship between factors A and B",
            "D. The confirmation of previous studies' results",
          ],
        },
        {
          id: "rq11",
          type: "multiplechoice",
          question: "11. What limitation of the research does the author acknowledge?",
          options: [
            "A. Small sample size",
            "B. Potential researcher bias",
            "C. Limited geographical scope",
            "D. Outdated methodology",
          ],
        },
        {
          id: "rq12",
          type: "multiplechoice",
          question: "12. What does the author suggest for future research?",
          options: [
            "A. Replicating the study with a larger sample",
            "B. Using different methodologies",
            "C. Focusing on different variables",
            "D. Collaborating with international researchers",
          ],
        },
        {
          id: "rq13",
          type: "multiplechoice",
          question: "13. What is the primary purpose of the passage?",
          options: [
            "A. To criticize previous research",
            "B. To present new findings",
            "C. To compare competing theories",
            "D. To propose a new methodology",
          ],
        },
      ],
    },
    {
      title: "Passage 2",
      content: `This is the content of Reading Passage 2. In the actual test, this would be a longer text of around 900 words.

The passage would typically be an authentic text on an academic subject of general interest, taken from a book, journal, magazine, or newspaper.

You should read this passage carefully and answer the questions that follow.`,
      questions: [
        {
          id: "rq14",
          type: "matching",
          question: "14-20. Match each statement with the correct person, A-G.",
          options: [
            "A. Dr. Smith",
            "B. Professor Johnson",
            "C. Researcher Williams",
            "D. Dr. Brown",
            "E. Professor Davis",
            "F. Researcher Wilson",
            "G. Dr. Taylor",
          ],
          statements: [
            { id: "rq14", text: "14. Believed that the traditional approach was flawed." },
            { id: "rq15", text: "15. Proposed a new theoretical framework." },
            { id: "rq16", text: "16. Conducted the first empirical study on the subject." },
            { id: "rq17", text: "17. Criticized the methodology of previous studies." },
            { id: "rq18", text: "18. Found contradictory evidence to the established theory." },
            { id: "rq19", text: "19. Suggested practical applications for the research findings." },
            { id: "rq20", text: "20. Advocated for interdisciplinary collaboration." },
          ],
        },
        {
          id: "rq21",
          type: "completion",
          question:
            "21-26. Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          summary: `The research on this topic began in the early 21._______ when scientists first observed the phenomenon. Initially, they believed it was caused by 22._______, but later studies revealed a more complex explanation. The breakthrough came when researchers developed a new 23._______ that allowed for more precise measurements. This led to the discovery that the process occurs in three distinct 24._______, each with its own characteristics. The implications of these findings extend beyond the original field to areas such as 25._______ and environmental science. Current research is focused on understanding how external 26._______ might influence the process.`,
        },
      ],
    },
    {
      title: "Passage 3",
      content: `This is the content of Reading Passage 3. In the actual test, this would be a longer text of around 900 words.

The passage would typically be an authentic text on an academic subject of general interest, taken from a book, journal, magazine, or newspaper.

You should read this passage carefully and answer the questions that follow.`,
      questions: [
        {
          id: "rq27",
          type: "headings",
          question: "27-33. Match each paragraph (A-G) with the most suitable heading (i-x).",
          options: [
            "i. Historical background",
            "ii. Competing theories",
            "iii. Methodological challenges",
            "iv. Recent discoveries",
            "v. Practical applications",
            "vi. Future directions",
            "vii. Limitations of current knowledge",
            "viii. Interdisciplinary perspectives",
            "ix. Ethical considerations",
            "x. Global implications",
          ],
          paragraphs: [
            { id: "rq27", text: "A. The first paragraph of the passage." },
            { id: "rq28", text: "B. The second paragraph of the passage." },
            { id: "rq29", text: "C. The third paragraph of the passage." },
            { id: "rq30", text: "D. The fourth paragraph of the passage." },
            { id: "rq31", text: "E. The fifth paragraph of the passage." },
            { id: "rq32", text: "F. The sixth paragraph of the passage." },
            { id: "rq33", text: "G. The seventh paragraph of the passage." },
          ],
        },
        {
          id: "rq34",
          type: "yesnonotgiven",
          question: "34. The author agrees with the mainstream view on this topic.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq35",
          type: "yesnonotgiven",
          question: "35. The research has led to practical applications in industry.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq36",
          type: "yesnonotgiven",
          question: "36. The author has personally conducted research in this field.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq37",
          type: "yesnonotgiven",
          question: "37. Government funding for this research has increased in recent years.",
          options: ["YES", "NO", "NOT GIVEN"],
        },
        {
          id: "rq38",
          type: "multiplechoice",
          question: "38. What is the author's main criticism of the current research?",
          options: [
            "A. It focuses too narrowly on specific aspects",
            "B. It relies too heavily on outdated theories",
            "C. It fails to consider alternative explanations",
            "D. It does not adequately address practical applications",
          ],
        },
        {
          id: "rq39",
          type: "multiplechoice",
          question: "39. According to the passage, what is the most promising direction for future research?",
          options: [
            "A. Developing new theoretical models",
            "B. Conducting larger-scale empirical studies",
            "C. Exploring interdisciplinary connections",
            "D. Focusing on practical applications",
          ],
        },
        {
          id: "rq40",
          type: "multiplechoice",
          question: "40. Which of the following best describes the author's tone in the passage?",
          options: [
            "A. Enthusiastic and optimistic",
            "B. Critical but constructive",
            "C. Neutral and objective",
            "D. Skeptical and cautious",
          ],
        },
      ],
    },
  ]

  const currentPassageData = passages[currentPassage - 1]

  if (!isStarted) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">IELTS Reading Test</h1>
        <p className="mb-4">
          This test consists of three passages with a total of 40 questions. You have 60 minutes to complete the test.
        </p>
        <p className="mb-4">
          You should spend about 20 minutes on each passage. The passages will increase in difficulty level.
        </p>
        <Button onClick={handleStartTest}>Start Test</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reading {currentPassageData.title}</h1>
        <div className="text-xl font-semibold">Time Remaining: {formatTime(timeRemaining)}</div>
      </div>

      <TextAnnotationTools
        onCircleClick={handleCircleClick}
        onUnderlineClick={handleUnderlineClick}
        onUndoClick={handleUndoAnnotation}
        activeMode={currentTool}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="mb-4 lg:mb-0">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Reading Passage</h2>
            <TextAnnotator
              content={currentPassageData.content}
              annotations={annotations}
              onAnnotation={handleAnnotation}
              currentTool={currentTool}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Questions</h2>
            <div className="space-y-6">
              {currentPassageData.questions.map((question) => {
                if (question.type === "truefalse" || question.type === "yesnonotgiven") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="space-y-2">
                        {question.options?.map((option) => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`${question.id}-${option}`}
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerChange(question.id, option)}
                              className="mr-2"
                            />
                            <label htmlFor={`${question.id}-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                } else if (question.type === "multiplechoice") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="space-y-2">
                        {question.options?.map((option) => (
                          <div key={option} className="flex items-center">
                            <input
                              type="radio"
                              id={`${question.id}-${option}`}
                              name={question.id}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerChange(question.id, option)}
                              className="mr-2"
                            />
                            <label htmlFor={`${question.id}-${option}`}>{option}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                } else if (question.type === "shortanswer") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <input
                        type="text"
                        value={answers[question.id] || ""}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        placeholder="Enter your answer"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )
                } else if (question.type === "matching") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Options:</h4>
                          <ul className="list-disc pl-5">
                            {question.options?.map((option) => (
                              <li key={option}>{option}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Statements:</h4>
                          {question.statements?.map((statement) => (
                            <div key={statement.id} className="mb-2">
                              <p>{statement.text}</p>
                              <input
                                type="text"
                                value={answers[statement.id] || ""}
                                onChange={(e) => handleAnswerChange(statement.id, e.target.value)}
                                placeholder="Enter letter (A-G)"
                                className="w-full p-2 border rounded mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                } else if (question.type === "completion") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                        {question.summary?.split(/(\d+\._______)/g).map((part, index) => {
                          if (part.match(/\d+\._______/)) {
                            const questionNumber = part.match(/(\d+)\._______/)?.[1]
                            const inputId = `rq${questionNumber}`
                            return (
                              <span key={index} className="inline-block">
                                <input
                                  type="text"
                                  value={answers[inputId] || ""}
                                  onChange={(e) => handleAnswerChange(inputId, e.target.value)}
                                  placeholder="________"
                                  className="w-24 p-1 border rounded mx-1 inline-block"
                                />
                              </span>
                            )
                          }
                          return <span key={index}>{part}</span>
                        })}
                      </div>
                    </div>
                  )
                } else if (question.type === "headings") {
                  return (
                    <div key={question.id} className="mb-4">
                      <p className="mb-2">{question.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Headings:</h4>
                          <ul className="list-disc pl-5">
                            {question.options?.map((option) => (
                              <li key={option}>{option}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Paragraphs:</h4>
                          {question.paragraphs?.map((paragraph) => (
                            <div key={paragraph.id} className="mb-2">
                              <p>{paragraph.text}</p>
                              <input
                                type="text"
                                value={answers[paragraph.id] || ""}
                                onChange={(e) => handleAnswerChange(paragraph.id, e.target.value)}
                                placeholder="Enter heading number (i-x)"
                                className="w-full p-2 border rounded mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-4">
        {currentPassage > 1 && <Button onClick={handlePreviousPassage}>Previous Passage</Button>}
        {currentPassage < 3 ? (
          <Button onClick={handleNextPassage} className="ml-auto">
            Next Passage
          </Button>
        ) : (
          <Button onClick={handleFinishTest} className="ml-auto">
            Go to Writing
          </Button>
        )}
      </div>
    </div>
  )
}
