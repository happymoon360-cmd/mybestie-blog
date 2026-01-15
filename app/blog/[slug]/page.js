import { getAllPostIds, getPostData } from '../../../lib/posts';
import styles from './page.module.css';
import ProductLinkTracker from '../../components/ProductLinkTracker';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    return {
        title: postData.title,
        description: postData.description,
        openGraph: {
            title: postData.title,
            description: postData.description,
            type: 'article',
            publishedTime: postData.date,
            images: postData.image ? [postData.image] : [],
        },
    };
}

export default async function Post({ params }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: postData.title,
        description: postData.description,
        image: postData.image ? [postData.image] : [],
        datePublished: postData.date,
        author: {
            '@type': 'Person',
            name: 'Author Name', // You might want to make this dynamic or config based
        },
    };

    return (
        <article className={styles.article}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductLinkTracker />
            <h1 className={styles.title}>{postData.title}</h1>
            <div className={styles.date}>{postData.date}</div>
            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />
        </article>
    );
}
