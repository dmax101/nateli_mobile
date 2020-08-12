import axios from 'axios';

const api = axios.create({
    /*
        curl \
        -H 'Authorization: Bearer PG4WVUCICSUSXDDKHF76RXPPOOMMOR2V' \
        'https://api.wit.ai/message?v=20200811&q=Ligar%20a%20luz%20da%20garagem'
    */
    baseURL: 'http://192.168.0.105:3333'
})

export default api;