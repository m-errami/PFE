import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

export default http
