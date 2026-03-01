"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchNextQuestion, answerQuestion } from "@/lib/api"
import { Question } from "@/lib/types"
import ProgressBar from "@/components/ProgressBar"

function CategoryPage() {
    const params = useParams()
    const categoryId = Number(params.id)

    const [question, setQuestion] = useState<Question | null>(null)
    const [result, setResult] = useState<string | null>(null)
    const [answered, setAnswered] = useState(false)
    const [loading, setLoading] = useState(false)

    const loadQuestion = async () => {
        const q = await fetchNextQuestion(categoryId)
        setQuestion(q)
        setResult(null)
        setAnswered(false)
    }

    useEffect(() => {
        loadQuestion()
    }, [])

    if (!question) return <div>Lade...</div>
    const { totalQuestions, correctAnswers, progressPercentage } = question


    return (
        <div style={{ padding: 20 }}>
            <p>
                {correctAnswers} von {totalQuestions} richtig
            </p>
            <ProgressBar percentage={progressPercentage} />


            <h2 style={{ marginTop: 20 }}>{question.text}</h2>

            {question.answers.map((answer, index) => (
                <button
                    key={index}
                    disabled={answered}
                    onClick={async () => {
                        if (!question.id) return

                        setLoading(true)

                        const res = await answerQuestion(
                            question.id,
                            index + 1
                        )

                        setResult(
                            res.correct ? "Richtig ✅" : "Falsch ❌"
                        )

                        setAnswered(true)
                        setLoading(false)
                    }}
                    style={{
                        display: "block",
                        marginBottom: 10,
                        padding: 8,
                        cursor: answered ? "not-allowed" : "pointer",
                        opacity: answered ? 0.6 : 1
                    }}
                >
                    {answer}
                </button>
            ))}

            {result && (
                <>
                    <p>{result}</p>
                    <button onClick={loadQuestion}>
                        Nächste Frage
                    </button>
                </>
            )}
        </div>
    )
}

export default CategoryPage