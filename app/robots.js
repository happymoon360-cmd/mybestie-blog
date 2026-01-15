export default function robots() {
    const baseUrl = 'https://example.com'; // Replace with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
