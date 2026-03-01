import Link from "next/link"
import { CategoryProgress } from "@/lib/types"
import ProgressBar from "@/components/ProgressBar";

interface Props {
    category: CategoryProgress
}

export default function CategoryCard({ category }: Props) {
    return (
        <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 16 }}>
            <h3>{category.name}</h3>
            <p>
                {category.correctAnswers} / {category.totalQuestions} richtig
            </p>

            <ProgressBar percentage={(category.progressPercentage)} />

            <div>
                <Link href={`/category/${category.id}`}>
                    Quiz starten
                </Link>
            </div>
        </div>
    )
}