import axios from "axios";

export default axios.create({
    baseURL: `https://map.foggystudio.com`,
    // withCredentials: true
});