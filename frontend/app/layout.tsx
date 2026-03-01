import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Quiz App",
    description: "Simple Quiz Application",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="de">
        <body
            style={{
                fontFamily: "Arial, sans-serif",
                margin: 0,
                backgroundColor: "#f5f5f5",
            }}
        >
        <header
            style={{
                padding: "16px 24px",
                backgroundColor: "#222",
                color: "white",
            }}
        >
            <h2 style={{ margin: 0 }}>Quiz App</h2>
        </header>

        <main style={{ padding: 24 }}>{children}</main>
        </body>
        </html>
    )
}