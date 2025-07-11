import axios from "axios";

const BackendUrl=import.meta.env.VITE_BACKEND_URL // getting the url form .env file
const api=axios.create({
    baseURL:BackendUrl,
    
})

export default api