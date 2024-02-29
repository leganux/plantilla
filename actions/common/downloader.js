const axios = require('axios');
const fs = require('fs');
const { createWriteStream } = require('fs');
const { join } = require('path');
const { pipeline } = require('stream');
const ProgressBar = require('cli-progress');

async function downloadFile(url, downloadPath) {
    const writer = createWriteStream(downloadPath);

    const progressBar = new ProgressBar.SingleBar({
        format: 'Downloading [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} MB',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const totalSize = parseInt(response.headers['content-length'], 10);
        progressBar.start(totalSize, 0);

        await new Promise((resolve, reject) => {
            pipeline(
                response.data,
                writer,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );

            response.data.on('data', chunk => {
                progressBar.increment(chunk.length);
            });
        });

        console.log('Download complete!');
        progressBar.stop();
    } catch (error) {
        console.error('Download failed:', error.message);
        progressBar.stop();
    }
}

// URL of the zip file to download




// Start the download
module.exports = downloadFile
