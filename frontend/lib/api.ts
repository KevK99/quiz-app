import { Question, AnswerResponse, CategoryProgress } from "./types"

const BASE_URL = "http://localhost:8080/api" // Backend base URL
const USER_ID = 1                            // Temporary — replace with auth system later

// GET /api/categories?userId=1
// Loads all categories with progress for the HomePage
export async function fetchCategories(): Promise<CategoryProgress[]> {
    const res = await fetch(`${BASE_URL}/categories?userId=${USER_ID}`)
    if (!res.ok) throw new Error("Failed to fetch categories")
    return res.json()
}

// GET /api/categories/{id}/next-question?userId=1
// Loads the next unanswered question for the selected category
export async function fetchNextQuestion(categoryId: number): Promise<Question> {
    const res = await fetch(
        `${BASE_URL}/categories/${categoryId}/next-question?userId=${USER_ID}`
    )
    if (!res.ok) throw new Error("Failed to fetch question")
    return res.json()
}

// POST /api/questions/{id}/answer
// Sends the selected answer to the backend and returns whether it was correct
export async function answerQuestion(
    questionId: number,
    selectedIndex: number  // 1–4, corresponds to the answer position
): Promise<AnswerResponse> {
    const res = await fetch(`${BASE_URL}/questions/${questionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedIndex })
    })

    if (!res.ok) {
        const text = await res.text()
        console.error(text)
        throw new Error("Failed to submit answer")
    }

    return res.json()
}