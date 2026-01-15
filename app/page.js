import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData } from '../lib/posts';
import styles from './page.module.css';

export default function Home() {
    const allPostsData = getSortedPostsData();

    return (
        <section>
            <div className={styles.header}>
                <h1>최신 글</h1>
                <p>새로운 이야기와 유용한 정보를 만나보세요.</p>
            </div>

            <div className={styles.grid}>
                {allPostsData.map(({ id, date, title, description, image }) => (
                    <Link href={`/blog/${id}`} key={id} className={styles.card}>
                        {image && (
                            <div className={styles.imageContainer}>
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={styles.thumbnail}
                                    priority={true}
                                />
                            </div>
                        )}
                        <div className={styles.cardContent}>
                            <h2 className={styles.title}>{title}</h2>
                            <p className={styles.description}>{description}</p>
                            <div className={styles.meta}>
                                <span className={styles.date}>{date}</span>
                                <span className={styles.readMore}>더 보기 →</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
