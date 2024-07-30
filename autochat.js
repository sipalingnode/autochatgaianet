const axios = require("axios");
const fs = require('fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

;(async()=>{

    console.log('AUTOCHAT GAIANET BY AIRDROP ASC\n\n')
    const addressList = await fs.readFileSync('chat.txt', 'utf-8');
    const addressListArray = await addressList.split('\n');

    for (let index = 11; index < addressListArray.length; index++) {
        const Wallet = addressListArray[index];
        console.log("Question: " + Wallet + "\n");

        const response = await axios.post(
            'https://nodeidmu.us.gaianet.network/v1/chat/completions',
            {
                'messages': [
                  {
                    'role': 'system',
                    'content': 'You are a helpful assistant.'
                  },
                  {
                    'role': 'user',
                    'content': `${Wallet}`
                  }
                ]
              },
            {
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(" " + response.data.choices[0].message.content + "\n");
          console.log("Done Jalan Otomatis \n\n");
          await delay(30000);
    }
   
})();
