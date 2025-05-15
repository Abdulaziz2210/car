"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { TextAnnotator } from "@/components/text-annotator"
import { TextAnnotationTools } from "@/components/text-annotation-tools"

export default function ListeningTest() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isStarted, setIsStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(40 * 60) // 40 minutes in seconds
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [annotations, setAnnotations] = useState<any[]>([])
  const [currentTool, setCurrentTool] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    const savedAnswers = localStorage.getItem("listeningAnswers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }

    // Load saved annotations from localStorage
    const savedAnnotations = localStorage.getItem("listeningAnnotations")
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations))
    }

    // Check if test was already started
    const testStarted = localStorage.getItem("listeningTestStarted")
    if (testStarted === "true") {
      setIsStarted(true)
    }

    // Load current section
    const savedSection = localStorage.getItem("currentListeningSection")
    if (savedSection) {
      setCurrentSection(Number.parseInt(savedSection))
    }
  }, [])

  useEffect(() => {
    // Save current section to localStorage
    localStorage.setItem("currentListeningSection", currentSection.toString())
  }, [currentSection])

  useEffect(() => {
    // Save answers to localStorage
    localStorage.setItem("listeningAnswers", JSON.stringify(answers))
  }, [answers])

  useEffect(() => {
    // Save annotations to localStorage
    localStorage.setItem("listeningAnnotations", JSON.stringify(annotations))
  }, [annotations])

  useEffect(() => {
    // Save test started status to localStorage
    localStorage.setItem("listeningTestStarted", isStarted.toString())
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

  const handleNextSection = () => {
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1)
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    } else {
      // Navigate to the next section (Reading)
      localStorage.setItem("currentSection", "reading")
      router.push("/reading")
    }
  }

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleFinishTest = () => {
    // Navigate to the next section (Reading)
    localStorage.setItem("currentSection", "reading")
    router.push("/reading")
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback error:", error)
          setAudioError("Failed to play audio. Please check your audio file.")
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioLoad = () => {
    setAudioLoaded(true)
    setAudioError(null)
  }

  const handleAudioError = () => {
    setAudioLoaded(false)
    setAudioError("Failed to load audio file. Please check the file path.")
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

  // Listening sections content
  const sections = [
    {
      title: "Section 1",
      instructions:
        "Questions 1-10: Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
      content: `This is the transcript area for Section 1. In the actual test, you would listen to an audio recording.

The audio for Section 1 typically features a conversation between two people in an everyday social context, such as a conversation about accommodation arrangements or making a booking.

You should take notes here as you listen to help you answer the questions.`,
      audioPath: "/audio/section1.mp3", // Replace with actual audio path
      questions: [
        {
          id: "lq1",
          type: "shortanswer",
          question: "1. Name: Sarah _______",
        },
        {
          id: "lq2",
          type: "shortanswer",
          question: "2. Address: 45 _______ Street",
        },
        {
          id: "lq3",
          type: "shortanswer",
          question: "3. Postcode: _______",
        },
        {
          id: "lq4",
          type: "shortanswer",
          question: "4. Telephone: _______",
        },
        {
          id: "lq5",
          type: "shortanswer",
          question: "5. Email: sarah@_______",
        },
        {
          id: "lq6",
          type: "shortanswer",
          question: "6. Preferred appointment day: _______",
        },
        {
          id: "lq7",
          type: "shortanswer",
          question: "7. Preferred time: _______",
        },
        {
          id: "lq8",
          type: "shortanswer",
          question: "8. Reason for appointment: _______",
        },
        {
          id: "lq9",
          type: "shortanswer",
          question: "9. Previous customer: _______ (yes/no)",
        },
        {
          id: "lq10",
          type: "shortanswer",
          question: "10. Special requirements: _______",
        },
      ],
    },
    {
      title: "Section 2",
      instructions: "Questions 11-20: Complete the sentences below. Write NO MORE THAN THREE WORDS for each answer.",
      content: `This is the transcript area for Section 2. In the actual test, you would listen to an audio recording.

The audio for Section 2 typically features a monologue set in an everyday social context, such as a speech about local facilities or a talk about arrangements for a trip.

You should take notes here as you listen to help you answer the questions.`,
      audioPath: "/audio/section2.mp3", // Replace with actual audio path
      questions: [
        {
          id: "lq11",
          type: "shortanswer",
          question: "11. The community center was built in _______.",
        },
        {
          id: "lq12",
          type: "shortanswer",
          question: "12. The center is open from _______ to 9 PM on weekdays.",
        },
        {
          id: "lq13",
          type: "shortanswer",
          question: "13. Weekend hours are from 10 AM to _______.",
        },
        {
          id: "lq14",
          type: "shortanswer",
          question: "14. The main hall can accommodate up to _______ people.",
        },
        {
          id: "lq15",
          type: "shortanswer",
          question: "15. The center offers free _______ in the parking lot.",
        },
        {
          id: "lq16",
          type: "shortanswer",
          question: "16. To book a room, you need to fill out a _______ form.",
        },
        {
          id: "lq17",
          type: "shortanswer",
          question: "17. Bookings must be made at least _______ in advance.",
        },
        {
          id: "lq18",
          type: "shortanswer",
          question: "18. Payment can be made by cash, credit card, or _______.",
        },
        {
          id: "lq19",
          type: "shortanswer",
          question: "19. The center's café serves _______ food options.",
        },
        {
          id: "lq20",
          type: "shortanswer",
          question: "20. For more information, visit the center's _______.",
        },
      ],
    },
    {
      title: "Section 3",
      instructions: "Questions 21-30: Choose the correct letter, A, B, or C.",
      content: `This is the transcript area for Section 3. In the actual test, you would listen to an audio recording.

The audio for Section 3 typically features a conversation between up to four people set in an educational or training context, such as a university tutor and student discussing an assignment.

You should take notes here as you listen to help you answer the questions.`,
      audioPath: "/audio/section3.mp3", // Replace with actual audio path
      questions: [
        {
          id: "lq21",
          type: "multiplechoice",
          question: "21. What is the main topic of the students' project?",
          options: ["A. Urban development", "B. Environmental conservation", "C. Public transportation"],
        },
        {
          id: "lq22",
          type: "multiplechoice",
          question: "22. When is the project deadline?",
          options: ["A. Next week", "B. In two weeks", "C. At the end of the month"],
        },
        {
          id: "lq23",
          type: "multiplechoice",
          question: "23. What does the professor suggest the students do first?",
          options: ["A. Create a survey", "B. Review existing literature", "C. Collect data samples"],
        },
        {
          id: "lq24",
          type: "multiplechoice",
          question: "24. What problem does Sarah mention about their research?",
          options: ["A. Lack of recent data", "B. Conflicting information", "C. Limited access to resources"],
        },
        {
          id: "lq25",
          type: "multiplechoice",
          question: "25. What does the professor recommend for the presentation?",
          options: ["A. Use more visual aids", "B. Include case studies", "C. Focus on methodology"],
        },
        {
          id: "lq26",
          type: "multiplechoice",
          question: "26. How many students are working on this project?",
          options: ["A. Two", "B. Three", "C. Four"],
        },
        {
          id: "lq27",
          type: "multiplechoice",
          question: "27. What additional resource does the professor offer?",
          options: ["A. Extra funding", "B. Research assistant", "C. Access to a specialized database"],
        },
        {
          id: "lq28",
          type: "multiplechoice",
          question: "28. What aspect of the project will John be responsible for?",
          options: ["A. Data analysis", "B. Literature review", "C. Field research"],
        },
        {
          id: "lq29",
          type: "multiplechoice",
          question: "29. What does the professor say about the word count?",
          options: [
            "A. It can be exceeded by 10%",
            "B. It must be strictly adhered to",
            "C. It is a minimum requirement",
          ],
        },
        {
          id: "lq30",
          type: "multiplechoice",
          question: "30. When will the group meet with the professor again?",
          options: ["A. Tomorrow", "B. Next Monday", "C. After they submit the draft"],
        },
      ],
    },
    {
      title: "Section 4",
      instructions: "Questions 31-40: Complete the notes below. Write ONE WORD ONLY for each answer.",
      content: `This is the transcript area for Section 4. In the actual test, you would listen to an audio recording.

The audio for Section 4 typically features a monologue on an academic subject, such as a university lecture.

You should take notes here as you listen to help you answer the questions.`,
      audioPath: "/audio/section4.mp3", // Replace with actual audio path
      questions: [
        {
          id: "lq31",
          type: "shortanswer",
          question: "31. The lecture focuses on the _______ of marine ecosystems.",
        },
        {
          id: "lq32",
          type: "shortanswer",
          question: "32. Coral reefs are sometimes called the _______ of the ocean.",
        },
        {
          id: "lq33",
          type: "shortanswer",
          question: "33. Rising sea temperatures can cause coral _______.",
        },
        {
          id: "lq34",
          type: "shortanswer",
          question: "34. Mangrove forests provide _______ for many marine species.",
        },
        {
          id: "lq35",
          type: "shortanswer",
          question: "35. Seagrass meadows are important for carbon _______.",
        },
        {
          id: "lq36",
          type: "shortanswer",
          question: "36. Deep-sea vents create a unique _______ for specialized organisms.",
        },
        {
          id: "lq37",
          type: "shortanswer",
          question: "37. Overfishing has led to a _______ in many fish populations.",
        },
        {
          id: "lq38",
          type: "shortanswer",
          question: "38. Plastic pollution is particularly harmful to _______ animals.",
        },
        {
          id: "lq39",
          type: "shortanswer",
          question: "39. Marine protected areas can help ecosystems _______.",
        },
        {
          id: "lq40",
          type: "shortanswer",
          question: "40. The lecturer emphasizes the need for international _______.",
        },
      ],
    },
  ]

  const currentSectionData = sections[currentSection - 1]

  if (!isStarted) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">IELTS Listening Test</h1>
        <p className="mb-4">
          This test consists of four sections with a total of 40 questions. You have 40 minutes to complete the test.
        </p>
        <p className="mb-4">
          You will listen to four recordings and answer questions on what you hear. There will be time for you to read
          the instructions and questions, and you will have a chance to check your work.
        </p>
        <Button onClick={handleStartTest}>Start Test</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Listening {currentSectionData.title}</h1>
        <div className="text-xl font-semibold">Time Remaining: {formatTime(timeRemaining)}</div>
      </div>

      <TextAnnotationTools
        onCircleClick={handleCircleClick}
        onUnderlineClick={handleUnderlineClick}
        onUndoClick={handleUndoAnnotation}
        activeMode={currentTool}
      />

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold mb-2">Audio Controls</h2>
            <audio
              ref={audioRef}
              src={currentSectionData.audioPath}
              onLoadedData={handleAudioLoad}
              onError={handleAudioError}
              className="w-full"
              controls
            />
            <Button onClick={handlePlayPause} disabled={!audioLoaded} className="w-full">
              {isPlaying ? "Pause" : "Play"}
            </Button>
            {audioError && <div className="text-red-500 mt-2">{audioError}</div>}
            {!audioLoaded && !audioError && (
              <div className="text-gray-500 mt-2">
                Loading audio... (Note: You will need to add your own audio files)
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Transcript Area</h2>
          <p className="mb-4">{currentSectionData.instructions}</p>
          <TextAnnotator
            content={currentSectionData.content}
            annotations={annotations}
            onAnnotation={handleAnnotation}
            currentTool={currentTool}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSectionData.questions.map((question) => (
              <div key={question.id} className="mb-4">
                <p className="mb-2">{question.question}</p>
                {question.type === "multiplechoice" ? (
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
                ) : (
                  <input
                    type="text"
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Enter your answer"
                    className="w-full p-2 border rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4">
        {currentSection > 1 && <Button onClick={handlePreviousSection}>Previous Section</Button>}
        {currentSection < 4 ? (
          <Button onClick={handleNextSection} className="ml-auto">
            Next Section
          </Button>
        ) : (
          <Button onClick={handleFinishTest} className="ml-auto">
            Go to Reading
          </Button>
        )}
      </div>
    </div>
  )
}
