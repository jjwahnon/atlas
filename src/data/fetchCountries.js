import axios from 'axios';

export async function fetchCountries(){
    let config = {
        method: 'get', 
        maxBodyLength: Infinity, 
        url: 'https://restcountries.com/v3.1/all', 
        headers: {}
    };

    let response = await axios.request(config);
    console.log("response: ", response.data);
    return response.data;
};
