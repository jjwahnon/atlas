import axios from 'axios';

export async function fetchCountry(name){
    let config = {
        method: 'get', 
        maxBodyLength: Infinity, 
        url: `https://restcountries.com/v3.1/name/${name}`, 
        headers: {}
    };
    let response= await axios.request(config);
    return response.data;
}