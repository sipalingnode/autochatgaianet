const axios = require("axios");
const fs = require('fs');

// Konfigurasi
const API_TIMEOUT = 15000;
const RETRY_DELAY = 5000;
const MAX_RETRIES = 3;
const MIN_DELAY = 2000;  // Delay minimum 2 detik
const MAX_DELAY = 5000;  // Delay maksimum 5 detik

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

;(async () => {
    try {
        console.log('AUTOCHAT GAIANET BY AIRDROP ASC\n\n');
        const addressList = fs.readFileSync('chat.txt', 'utf-8');
        const addressListArray = addressList.split('\n').filter(line => line.trim() !== '');
        
        for (let index = 11; index < addressListArray.length; index++) {
            const Wallet = addressListArray[index].trim();
            console.log(`Processing [${index + 1}/${addressListArray.length}]: ${Wallet}`);
            
            let retryCount = 0;
            let success = false;

            while (retryCount < MAX_RETRIES && !success) {
                try {
                    const response = await axios.post(
                        'https://vkvik.gaia.domains/v1/chat/completions',
                        {
                            messages: [
                                { role: 'system', content: 'You are a helpful assistant.' },
                                { role: 'user', content: Wallet }
                            ]
                        },
                        {
                            headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
                            timeout: API_TIMEOUT
                        }
                    );

                    // Validasi struktur respons
                    if (response.data?.choices?.[0]?.message?.content) {
                        console.log("Response:", response.data.choices[0].message.content);
                    } else {
                        console.error("Invalid response structure:", response.data);
                        fs.appendFileSync('failed.txt', `${Wallet}|INVALID_RESPONSE\n`);
                    }
                    
                    success = true;

                } catch (error) {
                    retryCount++;
                    const isRetryable = 
                        error.code === 'ECONNABORTED' || 
                        error.response?.status >= 500;

                    if (isRetryable && retryCount < MAX_RETRIES) {
                        console.error(`[Attempt ${retryCount}] Retrying in ${RETRY_DELAY/1000}s...`);
                        await delay(RETRY_DELAY);
                    } else {
                        console.error("Final Error:", error.message);
                        fs.appendFileSync('failed.txt', `${Wallet}|${error.message}\n`);
                        break;
                    }
                }
            }

            // Randomized delay antara 2-5 detik
            const randomDelay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
            console.log(`Menunggu ${Math.round(randomDelay/1000)} detik...\n`);
            await delay(randomDelay);
        }
    } catch (error) {
        console.error("Fatal Error:", error);
    }
})();
