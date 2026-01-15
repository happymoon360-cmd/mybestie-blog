const fs = require('fs');
const https = require('https');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);

const posts = [
    {
        slug: 'spam-text-parking-number',
        images: [
            'https://postfiles.pstatic.net/MjAyNjAxMTJfMjY5/MDAxNzY4MjExNjE1MTY3.aF8bA4WLvxF0fsqcTNN7Qo4qNlbLNS69BBuzIzJS6Gog.4QFxRQr_K61R4b7vDxpq88MOh4VKRoZ-TD_HqtUfHhEg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMTJfMTY5/MDAxNzY4MjExNzMxMjUy.h62TSYINmHKdvQOTc2x3wj_1hhSJQ6If0qoTmyV1fp4g.SpSEIbf84SCn0dE65wWn-CXjSM_01dM3zZsE4do6Wbog.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMTJfNzUg/MDAxNzY4MjExODA5NTQ3.2ghLhQ_-Nz24ETU63PARUHJ4bUSH0r0BDQQ_wVl6I2Ag.x94-nIbVJH2DPB6GhENXwkQqAw78oFi2T-5oFjUZ-O4g.PNG/Gemini_Generated_Image_wiwsklwiwsklwiws_(1).png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMTJfMTQ3/MDAxNzY4MjExODYwMjI0.062wca8qOfaUziTKCsquUzXGpmEGSg3pSfxkoMiDu_wg.bVjf0-rFuhMZwLipEyQrsQ0HfIO8r-MDzYkVgp6VhvMg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMTJfMjU4/MDAxNzY4MjExOTI1NTUz.wntI9ZrNyzAxmbghWCTfSxXm3rCUl2NeXIUpHEJZ-Awg.6wh4aOZdXIiZ6hxjASfHEHgNQJC3BbFu6HkS6VTbflMg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMTJfMjcy/MDAxNzY4MjExOTU5MTkz.BPN8FI2CVR4ZbTYSYpdnIMXT2iN0PHTQQu3NxQUoea4g.0xNbXrL-NWgPrGlFOksEnA2fSun9ocBSDoY_6gr--Z0g.PNG/Gemini_Generated_Image_rg23c6rg23c6rg23_(1).png?type=w966'
        ]
    },
    {
        slug: '2026-civil-servant-salary-and-car-item',
        images: [
            'https://postfiles.pstatic.net/MjAyNjAxMDVfMjY0/MDAxNzY3NTkyNzc1NTM2.UKNTsDGrH_EK-EFS7QcoxMTHB0VgAhLfpkbeGAeGOzIg.5pa13ZCcL1LuLKR5KB4k4B0TjM6O51wiu_rBimEgRNwg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDVfNzUg/MDAxNzY3NTkwMjc0MzQ2.8BgRgIVJ40W1MpDlyk3tm9UrBErNadiqRvAOXdgKmjIg.lTdPqwdDkV0d2QwGMiIOPCvxaCRKJs4-xu4fo0qINKkg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDVfMTU2/MDAxNzY3NTk0NzQxNTky.T-LCSMZpzJgwap914i2KoyHI6iJqv30bxAhxX07uT4Eg.NWL_stqTJz7oS6YdZrO1QrmLJfdD5idktRv7lmyODegg.PNG/1.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDVfMTU0/MDAxNzY3NTkwMTY3MDM3.Cztrc_721Rnf1kgnarpPuRr18_BopleArCobRvy5plEg.TMFF4jfxtKlUVWqH9LIDUS-VN8aO-OtvEOR_MDlRSLMg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDVfMjM2/MDAxNzY3NTkwMjI0NTk1.d3Go2H_emRXxO6uwxFAihBr98rhjk2HADE3iKqhIC9Ug.ucCfoXyzOVjUbDnR4djWvf5xPLjL9pj6xvLCSImunwUg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDVfMjc4/MDAxNzY3NTk0NzU3Mzc5.BXUhkw07IWaZW5j-KJrUyquHQcnluWwr8fr63BmyxJIg.FGFMQRykh2cYRGkGctqGWc4XIwTNDfG4lvR4Uqzm-V4g.PNG/2.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDVfMTgz/MDAxNzY3NTk0NzY5NDAw.7Y5zu6RTKKGTAbLZYJDu_mZ1rqlx1B12z26Pn6bmEP4g.13F1BV8w0_ioTBSRAkelMHIisif0OAA54QlVMh7iPX8g.PNG/3.png?type=w966'
        ]
    },
    {
        slug: '2026-ev-subsidy-saving-tip',
        images: [
            'https://postfiles.pstatic.net/MjAyNjAxMDJfMjUy/MDAxNzY3MzQ1MTM2MjIx.q6OqYBoR2Msnzx8r0GMdmz8FCZCNC39qgDrLf52q87gg.vOx_jDs1pLxpRZ85U7bWuqmMQGb1N0EzYfr6R9TmqT8g.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDJfODkg/MDAxNzY3MzQ0Mzg0NjYx.WrsTW-cjW_EcHFoOeeaLCPTnESaOVwFNpZhpAS8LXV8g.6A9iW7Ure1ahI-AtCSaIWTInUnM8yXVA_q1eDyHGpjcg.PNG/image.png?type=w966',
            'https://postfiles.pstatic.net/MjAyNjAxMDJfMjMg/MDAxNzY3MzQ1MDcwMTM4.4nlOkg84M2DgPm5WR6Ej27GSQAixV4tJkiwDWcaUR5og.muRgjAHKDrHkKyBRcWoB_3eyjttjabOIGAU0WeOIDt8g.PNG/image.png?type=w966'
        ]
    }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else {
                res.consume();
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
};

const run = async () => {
    const baseDir = path.join(__dirname, 'public', 'images', 'posts');

    for (const post of posts) {
        const postDir = path.join(baseDir, post.slug);
        if (!fs.existsSync(postDir)) {
            await mkdir(postDir, { recursive: true });
        }

        console.log(`Processing ${post.slug}...`);
        for (let i = 0; i < post.images.length; i++) {
            // Determine extension (simple check)
            const url = post.images[i];
            let ext = '.png'; // Default based on URLs seen
            if (url.includes('.jpg') || url.includes('.jpeg')) ext = '.jpg';
            if (url.includes('.gif')) ext = '.gif';

            const filename = `image-${i + 1}${ext}`;
            const filepath = path.join(postDir, filename);

            console.log(`  Downloading ${filename}...`);
            try {
                await downloadImage(url, filepath);
            } catch (e) {
                console.error(`  Failed to download ${filename}: ${e.message}`);
            }
        }
    }
    console.log('All downloads complete.');
};

run();
