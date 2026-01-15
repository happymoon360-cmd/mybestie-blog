
const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    "https://postfiles.pstatic.net/MjAyNjAxMTNfMTUx/MDAxNzY4Mjg0MjI4NDIy.86O2lHl_k_EW-Liv4H4sOpzPl5NOFGiybbuKZjIHu3Ag.2c2KN-6FSlP4BmZAtGmk9rsg9mC_Ts0Wpk0uNckRy7cg.PNG/Gemini_Generated_Image_uev5jpuev5jpuev5.png?type=w966",
    "https://postfiles.pstatic.net/MjAyNjAxMTNfMTIw/MDAxNzY4Mjg0Mjg2MDY1.FwlXSmkShaOx8p6E81P81Lly9w08xCLvNFePGhWyC3og.YOhSngVwqmUtiOjvGTlRXptWU8efMmY5SiKm7DA7Pikg.PNG/Gemini_Generated_Image_75euhu75euhu75eu.png?type=w80_blur",
    "https://postfiles.pstatic.net/MjAyNjAxMTNfMjg0/MDAxNzY4Mjg0MzI1MTE4.Z8-XinXw64TA2sk71Rnf51giDek21pAsOZSagWakBaEg.8_Af6cEg9Ub921TdTDhHYhnbDUbefgN_9yPm2U5Nd3gg.PNG/Gemini_Generated_Image_xomjboxomjboxomj.png?type=w80_blur",
    "https://postfiles.pstatic.net/MjAyNjAxMTNfODcg/MDAxNzY4Mjg0MzM5NDAz.jqMduInySwHg9vDpTKPbBW2czXUOP0e7LglkPwlHitkg.pAc-K8-M0rEricb8NSsPI4oBq4ATzhomHWwRhjYBXAcg.PNG/Gemini_Generated_Image_fb98hufb98hufb98.png?type=w80_blur",
    "https://postfiles.pstatic.net/MjAyNjAxMTNfMjUg/MDAxNzY4Mjk3OTIwOTUx.EDMItszeGDqcTwH8TYpbhC-DUE2AMheUAdKDu2en8Kog.ETFUf3kZaAdpHy_9-TlzkU9jq9F3KVBAPGGP6PL8e9wg.PNG/Gemini_Generated_Image_arx35tarx35tarx3.png?type=w80_blur",
    "https://postfiles.pstatic.net/MjAyNjAxMTNfMTc4/MDAxNzY4Mjg0NDE3Nzc2.Ql7KgyQBCbcy-cV_7u0Hohqb2KxQk-coH5iUVGo8njkg.uTMPjGcZYTD8Gp8gMs4lB30HIfYtIPglbxGCxf4dSP8g.PNG/Gemini_Generated_Image_b5ypcfb5ypcfb5yp.png?type=w80_blur"
];

const downloadDir = path.join(__dirname, 'public', 'images', 'posts', 'migrated');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadImage(url, index) {
    // Fix low res URLs
    const highResUrl = url.replace('w80_blur', 'w966');
    const ext = path.extname(new URL(url).pathname) || '.png';
    const filename = `image-${index + 1}${ext}`;
    const filePath = path.join(downloadDir, filename);

    return new Promise((resolve, reject) => {
        https.get(highResUrl, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Failed to download ${highResUrl}: ${res.statusCode}`);
                // Try original URL if high res fails
                if (url !== highResUrl) {
                    console.log('Retrying with original URL...');
                    https.get(url, (retryRes) => {
                        if (retryRes.statusCode !== 200) {
                            reject(new Error(`Failed to download original ${url}: ${retryRes.statusCode}`));
                            return;
                        }
                        const fileStream = fs.createWriteStream(filePath);
                        retryRes.pipe(fileStream);
                        fileStream.on('finish', () => {
                            fileStream.close();
                            resolve(filename);
                        });
                    });
                    return;
                }
                reject(new Error(`Failed to download ${highResUrl}`));
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded ${filename}`);
                resolve(filename);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    for (let i = 0; i < images.length; i++) {
        await downloadImage(images[i], i);
    }
}

main().catch(console.error);
