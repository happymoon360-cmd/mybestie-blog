import { Analytics } from "@vercel/analytics/react"

// ... (existing imports)

// ...

export default function RootLayout({ children }) {
    return (
        <html lang="ko" className={inter.variable}>
            <body>
                <main>
                    <Header />
                    {children}
                    <Footer />
                    <Analytics />
                </main>
            </body>
        </html>
    );
}
