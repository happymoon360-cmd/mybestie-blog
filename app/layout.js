import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
});

export const metadata = {
    title: {
        template: '%s | Mybestie 카라이프 라운지',
        default: 'Mybestie 카라이프 라운지', // a default is required when creating a template
    },
    description: '프리미엄 자동차 용품과 품격 있는 카라이프 스타일을 제안하는 공간',
    keywords: ['자동차 용품', '안심번호', 'Mybestie', '카라이프', '자동차 인테리어'],
    openGraph: {
        title: 'Mybestie 카라이프 라운지',
        description: '프리미엄 자동차 용품과 품격 있는 카라이프 스타일을 제안하는 공간',
        type: 'website',
        siteName: 'Mybestie 카라이프 라운지',
    },
    verification: {
        google: 'rMBBt4euga4OlJH_pGFLv_Fo47K9nPAGd5B9_15-Otk',
    },
};

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
