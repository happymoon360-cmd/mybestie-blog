
const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    {
        url: "https://mblogvideo-phinf.pstatic.net/MjAyNjAxMTNfMjQ3/MDAxNzY4Mjg0NDk3NjYx.LsW6La8MUStO2AaVbb_vBJBA1_FRailCNGIsMaoRbgUg.f4ZvdxN9reRocSc26wOwHN9HjnbGWx0bj0_hE_M8wLEg.GIF/05._%EB%B2%88%ED%98%B8%ED%8C%90_(8.8-12).gif?type=mp4w800",
        ext: ".mp4" // It says type=mp4w800, so it's likely an MP4. 
    },
    {
        url: "https://dthumb-phinf.pstatic.net/?src=%22https%3A%2F%2Fshop-phinf.pstatic.net%2F20250929_160%2F17591354795705hqPc_PNG%2F76462411046366723_584329547.png%3Ftype%3Do1000%22&type=ff500_300",
        ext: ".png"
    },
    {
        url: "https://dthumb-phinf.pstatic.net/?src=%22https%3A%2F%2Fblogthumb.pstatic.net%2FMjAyNjAxMTJfMjY5%2FMDAxNzY4MjExNjE1MTY3.aF8bA4WLvxF0fsqcTNN7Qo4qNlbLNS69BBuzIzJS6Gog.4QFxRQr_K61R4b7vDxpq88MOh4VKRoZ-TD_HqtUfHhEg.PNG%2Fimage.png%3Ftype%3Dw2%22&type=ff500_300",
        ext: ".png"
    },
    {
        url: "https://phinf.pstatic.net/tvcast/20260113_95/sjhur360_17682977737162ee5d_JPEG/PublishThumb_20260113_184923_434.jpg",
        ext: ".jpg"
    }
];

const downloadDir = path.join(__dirname, 'public', 'images', 'posts', 'migrated');

async function downloadImage(item, index) {
    const filename = `image-${index + 7}${item.ext}`; // Start from image-7
    const filePath = path.join(downloadDir, filename);

    return new Promise((resolve, reject) => {
        https.get(item.url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download ${item.url}: ${res.statusCode}`));
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
