"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchCategories } from "@/lib/api"
import { CategoryProgress } from "@/lib/types"
import ProgressBar from "@/components/ProgressBar"

export default function HomePage() {
    const [categories, setCategories] = useState<CategoryProgress[]>([])
    const [loading, setLoading] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Load categories with progress from the backend on mount
        fetchCategories().then((cats) => {
            setCategories(cats)
            setLoading(false)
        })
    }, [])

    // Sum up totals across all categories
    const totalQuestions = categories.reduce((s, c) => s + c.totalQuestions, 0)
    const totalCorrect = categories.reduce((s, c) => s + c.correctAnswers, 0)
    const overallPercent = totalQuestions === 0
        ? 0
        : Math.round(totalCorrect / totalQuestions * 100)

    // true when every category has 100% progress → show results screen
    const allDone = categories.length > 0 && categories.every((c) => c.progressPercentage === 100)

    // Grade label based on overall percentage
    const grade = overallPercent === 100 ? "🏆 Perfect!"
        : overallPercent >= 80 ? "🌟 Excellent!"
            : overallPercent >= 60 ? "👍 Well done!"
                : overallPercent >= 40 ? "💪 Keep practicing!"
                    : "📚 Start over!"

    const handleStart = () => {
        // Find the first category that hasn't been completed yet
        const next = categories.find((c) => c.progressPercentage < 100)
        if (!next) return
        setFadeOut(true)
        setTimeout(() => router.push(`/category/${next.id}`), 400)
    }

    if (loading) return <div style={pageStyle}>Loading...</div>

    // ── Results screen: all categories completed ───────────────────
    if (allDone) {
        return (
            <div className="fade-in" style={pageStyle}>
                <p style={{ color: "#6b7280", marginBottom: 4, fontSize: 14 }}>Your result</p>
                <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 4px" }}>{grade}</h1>

                {/* Large percentage as the central visual element */}
                <p style={{ fontSize: 52, margin: "12px 0", fontWeight: 800 }}>{overallPercent}%</p>

                <p style={{ color: "#6b7280", marginBottom: 40 }}>
                    {totalCorrect} of {totalQuestions} questions correct
                </p>

                {/* One card per category showing score and progress bar */}
                <div style={{ width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", gap: 16 }}>
                    {categories.map((cat) => {
                        const pct = Math.round(cat.correctAnswers / cat.totalQuestions * 100)
                        return (
                            <div key={cat.id} style={{
                                backgroundColor: "white", borderRadius: 12,
                                padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700 }}>{cat.name}</span>
                                    <span style={{ color: "#6b7280", fontSize: 14 }}>
                                        {cat.correctAnswers}/{cat.totalQuestions} correct
                                    </span>
                                </div>
                                <ProgressBar percentage={pct} label={`${pct}%`} />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    // ── Start screen ───────────────────────────────────────────────
    return (
        <div className={fadeOut ? "fade-out" : "fade-in"} style={pageStyle}>
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Quiz App</h1>
            <p style={{ color: "#6b7280", marginBottom: 48, fontSize: 16 }}>
                {categories.length} categories · {totalQuestions} questions
            </p>
            <button onClick={handleStart} style={btnStyle}>
                Start quiz →
            </button>
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