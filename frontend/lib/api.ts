import { Question, AnswerResponse, CategoryProgress } from "./types"

const BASE_URL = "http://localhost:8080/api"
const USER_ID = 1

export async function fetchCategories(): Promise<CategoryProgress[]> {
    const res = await fetch(`${BASE_URL}/categories?userId=${USER_ID}`)
    if (!res.ok) throw new Error("Failed to fetch categories")
    return res.json()
}

export async function fetchNextQuestion(categoryId: number): Promise<Question> {
    const res = await fetch(
        `${BASE_URL}/categories/${categoryId}/next-question?userId=${USER_ID}`
    )

    if (!res.ok) throw new Error("Failed to fetch question")

    return res.json()
}

export async function answerQuestion(
    questionId: number,
    selectedIndex: number
): Promise<AnswerResponse> {

    const res = await fetch(
        `${BASE_URL}/questions/${questionId}/answer`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ selectedIndex })
        }
    )

    if (!res.ok) {
        const text = await res.text()
        console.error(text)
        throw new Error("Failed to submit answer")
    }

    return res.json()
}