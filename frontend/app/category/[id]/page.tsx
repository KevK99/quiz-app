"use client" // Next.js: this component runs in the browser (requires useState, useEffect)

import ProgressBar from "@/components/ProgressBar";
import {answerQuestion, fetchCategories, fetchNextQuestion} from "@/lib/api";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Question} from "@/lib/types";

function CategoryPage() {
    const params = useParams()
    const router = useRouter()
    const categoryId = Number(params.id) // Category ID from the URL: /category/2

    // The current question from the backend (null = not yet loaded)
    const [question, setQuestion] = useState<Question | null>(null)
    const [categoryName, setCategoryName] = useState("")

    // Result after answering: { text: "Correct ✅", correct: true }
    const [result, setResult] = useState<{ text: string; correct: boolean } | null>(null)

    const [answered, setAnswered] = useState(false)   // Lock buttons after answering
    const [loading, setLoading] = useState(false)     // Prevent double submission
    const [categoryDone, setCategoryDone] = useState(false) // All questions answered?
    const [fadeOut, setFadeOut] = useState(false)     // For page transition animation

    // Load the next (or first) question from the backend and reset state
    const loadQuestion = async () => {
        const q = await fetchNextQuestion(categoryId)
        setQuestion(q)
        setResult(null)
        setAnswered(false)

        // Backend signals category completion by returning id = null
        if (!q.id) setCategoryDone(true)
    }

    useEffect(() => {
        // On first render: fetch the category name and load the first question
        fetchCategories().then((cats) => {
            const cat = cats.find((c) => c.id === categoryId)
            if (cat) setCategoryName(cat.name)
        })
        loadQuestion()
    }, [categoryId]) // Re-runs when the user switches to a different category

    const handleAnswer = async (index: number) => {
        if (!question?.id || answered) return // Prevent double click
        setLoading(true)

        // index is 0-based from the frontend (array index),
        // the backend expects 1-based → index + 1
        const res = await answerQuestion(question.id, index + 1)

        setResult({ text: res.correct ? "Correct ✅" : "Wrong ❌", correct: res.correct })
        setAnswered(true) // Lock all answer buttons
        setLoading(false)
    }

    const handleNextQuestion = () => {
        loadQuestion() // Simply load the next question — no manual counting needed
    }

    const goToNext = async () => {
        setFadeOut(true)
        await new Promise((r) => setTimeout(r, 400)) // Wait for fade-out animation

        const categories = await fetchCategories()

        // Find the next category that has not been completed yet
        const next = categories.find((c) => c.id !== categoryId && c.progressPercentage < 100)

        if (next) {
            router.push(`/category/${next.id}`)
        } else {
            // All categories done → go to HomePage (shows overall results)
            router.push("/")
        }
    }

    if (!question) return <div style={pageStyle}>Loading...</div>

    // answeredQuestions comes from the backend and is the number of already answered questions.
    // The CURRENT question is therefore number (answeredQuestions + 1).
    // Example: 2 already answered → "Question 3 of 8"
    const { totalQuestions, correctAnswers, answeredQuestions } = question
    const currentQuestionNumber = answeredQuestions + 1

    // Category complete screen
    if (categoryDone) {
        return (
            <div className={fadeOut ? "fade-out" : "fade-in"} style={{ ...pageStyle, textAlign: "center" }}>
                <p style={{ color: "#6b7280", marginBottom: 4 }}>Category complete</p>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{categoryName}</h2>

                {/* Emoji feedback based on the result */}
                <p style={{ fontSize: 48, margin: "16px 0" }}>
                    {correctAnswers === totalQuestions ? "🏆"
                        : correctAnswers >= totalQuestions / 2 ? "👍"
                            : "💪"}
                </p>

                <p style={{ fontSize: 20, marginBottom: 24 }}>
                    <strong>{correctAnswers}</strong> of <strong>{totalQuestions}</strong> correct
                </p>

                <div style={{ width: "100%", maxWidth: 400, marginBottom: 32 }}>
                    {/* Progress bar shows the score (correct answers), not the progress */}
                    <ProgressBar
                        percentage={Math.round(correctAnswers / totalQuestions * 100)}
                        label={`${correctAnswers} / ${totalQuestions} correct`}
                    />
                </div>

                <button onClick={goToNext} style={btnStyle}>Continue →</button>
            </div>
        )
    }

    return (
        <div className="fade-in" style={pageStyle}>

            {/* Top progress bar: shows "Question X of Y" — based on answeredQuestions from the backend */}
            <div style={{ width: "100%", maxWidth: 560, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#374151" }}>{categoryName}</span>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                        Question {currentQuestionNumber} of {totalQuestions}
                    </span>
                </div>
                <ProgressBar
                    percentage={Math.round(currentQuestionNumber / totalQuestions * 100)}
                    label={`Question ${currentQuestionNumber} of ${totalQuestions}`}
                />
            </div>

            {/* Question text */}
            <div style={{
                width: "100%", maxWidth: 560, backgroundColor: "white",
                borderRadius: 14, padding: "28px 24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginTop: 24, marginBottom: 20,
            }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                    {question.text}
                </h2>
            </div>

            {/* Answer buttons — locked after answering (disabled + reduced opacity) */}
            <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 10 }}>
                {question.answers.map((answer, index) => (
                    <button
                        key={index}
                        disabled={answered}
                        onClick={() => handleAnswer(index)}
                        style={{
                            padding: "13px 18px", borderRadius: 10,
                            border: "1.5px solid #e5e7eb",
                            cursor: answered ? "not-allowed" : "pointer",
                            opacity: answered ? 0.65 : 1,
                            textAlign: "left", backgroundColor: "white",
                            fontSize: 15, fontWeight: 500,
                        }}
                    >
                        {/* Letter label A/B/C/D */}
                        <span style={{
                            display: "inline-block", width: 26, height: 26,
                            borderRadius: "50%", backgroundColor: "#e5e7eb",
                            textAlign: "center", lineHeight: "26px",
                            fontSize: 13, fontWeight: 700, marginRight: 12,
                        }}>
                            {String.fromCharCode(65 + index)} {/* 65 = ASCII code for 'A' */}
                        </span>
                        {answer}
                    </button>
                ))}
            </div>

            {/* Only shown after the user has answered */}
            {result && (
                <div style={{
                    marginTop: 20, width: "100%", maxWidth: 560,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <p style={{ fontWeight: "bold", fontSize: 16,
                        color: result.correct ? "#22c55e" : "#ef4444", margin: 0 }}>
                        {result.text}
                    </p>
                    <button onClick={handleNextQuestion} disabled={loading} style={btnStyle}>
                        Next question →
                    </button>
                </div>
            )}
        </div>
    )
}

const pageStyle: React.CSSProperties = {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 24,
}

const btnStyle: React.CSSProperties = {
    padding: "14px 40px",
    fontSize: 17,
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
}