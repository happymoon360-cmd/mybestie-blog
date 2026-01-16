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
        keywords: postData.keywords || [],
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

    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: postData.title,
            description: postData.description,
            keywords: postData.keywords ? postData.keywords.join(', ') : undefined,
            image: postData.image ? [postData.image] : [],
            datePublished: postData.date,
            author: {
                '@type': 'Organization',
                name: 'Mybestie',
            },
        }
    ];

    if (postData.product) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: postData.product.name,
            image: postData.image ? [postData.image] : [],
            description: postData.product.description || postData.description,
            brand: {
                '@type': 'Brand',
                name: postData.product.brand,
            },
            offers: {
                '@type': 'Offer',
                url: 'https://smartstore.naver.com/coolgrandpaw/products/9408767137', // Hardcoded for this demo, or add to frontmatter
                priceCurrency: postData.product.currency || 'KRW',
                price: postData.product.price || '0',
                availability: 'https://schema.org/InStock',
            },
        });
    }

    return (
        <article className={styles.article}>
            {schemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
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
