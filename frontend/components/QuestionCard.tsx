import { Question } from "@/lib/types"

interface Props {
    question: Question
    onAnswer: (index: number) => void
}

export default function QuestionCard({ question, onAnswer }: Props) {
    return (
        <div
            style={{
                background: "white",
                padding: 20,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h2>{question.text}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {question.answers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => onAnswer(index + 1)}
                        style={{
                            padding: 10,
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            cursor: "pointer",
                        }}
                    >
                        {answer}
                    </button>
                ))}
            </div>
        </div>
    )
}