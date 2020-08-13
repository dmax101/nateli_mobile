import axios from 'axios';

const api = axios.create({
    /*
        curl \
        -H 'Authorization: Bearer PG4WVUCICSUSXDDKHF76RXPPOOMMOR2V' \
        'https://api.wit.ai/message?v=20200811&q=Ligar%20a%20luz%20da%20garagem'
    */
    baseURL: 'https://api.wit.ai',
    headers: {'Authorization': 'Bearer PG4WVUCICSUSXDDKHF76RXPPOOMMOR2V'}
  });

export default api;