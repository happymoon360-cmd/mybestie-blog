'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <div className={styles.headerWrapper}>
            <header className={styles.headerContent}>
                <div className={styles.topBar}>
                    <Link href="/" className={styles.logo}>
                        Mybestie 카라이프 라운지
                    </Link>

                    <button
                        className={styles.hamburger}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Menu"
                        aria-expanded={isOpen}
                    >
                        <span className={`${styles.line} ${isOpen ? styles.open : ''}`}></span>
                        <span className={`${styles.line} ${isOpen ? styles.open : ''}`}></span>
                        <span className={`${styles.line} ${isOpen ? styles.open : ''}`}></span>
                    </button>
                </div>

                <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
                    <Link href="/" className={pathname === '/' ? styles.active : ''}>홈</Link>
                    <Link href="/about" className={pathname === '/about' ? styles.active : ''}>스토리</Link>
                </nav>
            </header>
        </div>
    );
}
