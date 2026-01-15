import { getSortedPostsData } from '../lib/posts';

export default function sitemap() {
    const baseUrl = 'https://example.com'; // Replace with actual domain
    const posts = getSortedPostsData();

    const blogPosts = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...blogPosts,
    ];
}
