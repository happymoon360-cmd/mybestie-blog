import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} Mybestie 카라이프 라운지. All rights reserved.</p>
        </footer>
    );
}
