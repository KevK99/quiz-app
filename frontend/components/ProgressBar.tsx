type ProgressBarProps = {
    percentage: number
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#eee",
                borderRadius: 8,
                overflow: "hidden",
                height: 50,
                marginTop: 10,
                marginBottom: 20,
                position: "relative"
            }}
        >
            <div
                style={{
                    width: `${percentage}%`,
                    backgroundColor: percentage === 100 ? "#22c55e" : "#3b82f6",
                    height: "100%",
                    transition: "width 0.3s ease"
                }}
            />

            <span
                style={{
                    position: "absolute",
                    width: "100%",
                    textAlign: "center",
                    fontSize: 14,
                    lineHeight: "24px",
                    fontWeight: "bold"
                }}
            >
                {percentage}%
            </span>
        </div>
    )
}