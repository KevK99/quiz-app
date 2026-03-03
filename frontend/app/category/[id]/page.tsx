"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchNextQuestion, answerQuestion, fetchCategories } from "@/lib/api"
import { Question } from "@/lib/types"
import ProgressBar from "@/components/ProgressBar"

function CategoryPage() {
    const params = useParams()
    const router = useRouter()
    const categoryId = Number(params.id)

    const [question, setQuestion] = useState<Question | null>(null)
    const [categoryName, setCategoryName] = useState("")
    const [result, setResult] = useState<{ text: string; correct: boolean } | null>(null)
    const [answered, setAnswered] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryDone, setCategoryDone] = useState(false)
    const [fadeOut, setFadeOut] = useState(false)

    // questionNumber State entfernt – kommt jetzt vom Backend via answeredQuestions

    const loadQuestion = async () => {
        const q = await fetchNextQuestion(categoryId)
        setQuestion(q)
        setResult(null)
        setAnswered(false)
        if (!q.id) setCategoryDone(true)
    }

    useEffect(() => {
        fetchCategories().then((cats) => {
            const cat = cats.find((c) => c.id === categoryId)
            if (cat) setCategoryName(cat.name)
        })
        loadQuestion()
    }, [categoryId])

    const handleAnswer = async (index: number) => {
        if (!question?.id || answered) return
        setLoading(true)
        const res = await answerQuestion(question.id, index + 1)
        setResult({ text: res.correct ? "Richtig ✅" : "Falsch ❌", correct: res.correct })
        setAnswered(true)
        setLoading(false)
    }

    const handleNextQuestion = () => {
        loadQuestion()
    }

    const goToNext = async () => {
        setFadeOut(true)
        await new Promise((r) => setTimeout(r, 400))

        const categories = await fetchCategories()
        const next = categories.find((c) => c.id !== categoryId && c.progressPercentage < 100)

        if (next) {
            router.push(`/category/${next.id}`)
        } else {
            router.push("/")
        }
    }

    if (!question) return <div className="fade-in" style={pageStyle}>Lade...</div>

    const { totalQuestions, correctAnswers, answeredQuestions } = question

    // ── Kategorie abgeschlossen ──────────────────────────────────────
    if (categoryDone) {
        return (
            <div className={fadeOut ? "fade-out" : "fade-in"} style={{ ...pageStyle, textAlign: "center" }}>
                <p style={{ color: "#6b7280", marginBottom: 4 }}>Kategorie abgeschlossen</p>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{categoryName}</h2>
                <p style={{ fontSize: 48, margin: "16px 0" }}>
                    {correctAnswers === totalQuestions ? "🏆" : correctAnswers >= totalQuestions / 2 ? "👍" : "💪"}
                </p>
                <p style={{ fontSize: 20, marginBottom: 24 }}>
                    <strong>{correctAnswers}</strong> von <strong>{totalQuestions}</strong> richtig
                </p>
                <div style={{ width: "100%", maxWidth: 400, marginBottom: 32 }}>
                    <ProgressBar
                        percentage={Math.round(correctAnswers / totalQuestions * 100)}
                        label={`${correctAnswers} / ${totalQuestions} richtig`}
                    />
                </div>
                <button onClick={goToNext} style={btnStyle}>
                    Weiter →
                </button>
            </div>
        )
    }

    // answeredQuestions = bereits beantwortete → aktuelle Frage = answeredQuestions + 1
    const currentQuestionNumber = answeredQuestions + 1

    // ── Frage ────────────────────────────────────────────────────────
    return (
        <div className={fadeOut ? "fade-out" : "fade-in"} style={pageStyle}>
            <div style={{ width: "100%", maxWidth: 560, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#374151" }}>{categoryName}</span>
                    <span style={{ fontSize: 13, color: "#6b7280" }}>
                        Frage {currentQuestionNumber} von {totalQuestions}
                    </span>
                </div>
                <ProgressBar
                    percentage={Math.round(currentQuestionNumber / totalQuestions * 100)}
                    label={`Frage ${currentQuestionNumber} von ${totalQuestions}`}
                />
            </div>

            <div style={{
                width: "100%", maxWidth: 560,
                backgroundColor: "white", borderRadius: 14,
                padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                marginTop: 24, marginBottom: 20, textAlign: "left",
            }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
                    {question.text}
                </h2>
            </div>

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
                            textAlign: "left",
                            backgroundColor: "white",
                            fontSize: 15, fontWeight: 500,
                        }}
                    >
                        <span style={{
                            display: "inline-block", width: 26, height: 26,
                            borderRadius: "50%", backgroundColor: "#e5e7eb",
                            textAlign: "center", lineHeight: "26px",
                            fontSize: 13, fontWeight: 700, marginRight: 12,
                        }}>
                            {String.fromCharCode(65 + index)}
                        </span>
                        {answer}
                    </button>
                ))}
            </div>

            {result && (
                <div style={{
                    marginTop: 20, width: "100%", maxWidth: 560,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <p style={{ fontWeight: "bold", fontSize: 16, color: result.correct ? "#22c55e" : "#ef4444", margin: 0 }}>
                        {result.text}
                    </p>
                    <button onClick={handleNextQuestion} disabled={loading} style={btnStyle}>
                        Nächste Frage →
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
    padding: "24px 16px",
}

const btnStyle: React.CSSProperties = {
    padding: "11px 28px", fontSize: 15,
    backgroundColor: "#3b82f6", color: "white",
    border: "none", borderRadius: 10,
    cursor: "pointer", fontWeight: "bold",
}

export default CategoryPage