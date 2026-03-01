"use client"

import { useEffect, useState } from "react"
import { fetchCategories } from "@/lib/api"
import { CategoryProgress } from "@/lib/types"
import ProgressBar from "@/components/ProgressBar"
import Link from "next/link"

export default function HomePage() {
    const [categories, setCategories] = useState<CategoryProgress[]>([])

    useEffect(() => {
        fetchCategories().then(setCategories)
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h1>Quiz Kategorien</h1>

            {categories.map((cat) => (
                <div
                    key={cat.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: 16,
                        marginBottom: 16,
                        borderRadius: 8
                    }}
                >
                    <h3>{cat.name}</h3>

                    <p>
                        {cat.correctAnswers} von {cat.totalQuestions} richtig
                    </p>

                    <ProgressBar percentage={cat.progressPercentage} />
                </div>
            ))}
            <Link href={`/category/${1}`}>
                <button style={{ marginTop: 10 }}>
                    Starten
                </button>
            </Link>
        </div>
    )
}