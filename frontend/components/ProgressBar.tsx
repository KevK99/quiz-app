type ProgressBarProps = {
    percentage: number
    label?: string
}

export default function ProgressBar({ percentage, label }: ProgressBarProps) {
    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#e5e7eb",
                borderRadius: 99,
                overflow: "hidden",
                height: 36,
                position: "relative",
            }}
        >
            <div
                style={{
                    width: `${percentage}%`,
                    backgroundColor: percentage === 100 ? "#22c55e" : "#3b82f6",
                    height: "100%",
                    borderRadius: 99,
                    transition: "width 0.4s ease",
                }}
            />
            <span
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#1f2937",
                    zIndex: 1,
                    pointerEvents: "none",
                    letterSpacing: "0.02em",
                }}
            >
                {label ?? `${percentage}%`}
            </span>
        </div>
    )
}