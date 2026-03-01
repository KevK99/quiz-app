export type Question = {
    id: number
    text: string
    answers: string[]

    totalQuestions: number
    correctAnswers: number
    progressPercentage: number
}

export interface AnswerResponse {
    correct: boolean
    correctIndex: number | null
    message: string
}

export interface CategoryProgress {
    id: number
    name: string
    totalQuestions: number
    correctAnswers: number
    progressPercentage: number
}