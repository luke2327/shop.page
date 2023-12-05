import axios from 'axios'

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:4001/api' : ''
axios.defaults.headers.post['Content-Type'] = 'application/json'
