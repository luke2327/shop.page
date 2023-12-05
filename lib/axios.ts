import axios from 'axios'

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8484/shop' : 'https://api.maplew.com/shop'
axios.defaults.headers.post['Content-Type'] = 'application/json'
