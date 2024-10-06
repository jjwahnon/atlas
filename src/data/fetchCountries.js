import axios from 'axios';

function columnDefs(response){
    console.log(" column Defs input: ", response);
    response=response.filter(
        function(element){
            return element !== undefined;
        }
    );
 
    const listOfKeys = response.map(obj => Object.keys(obj))[0];
    console.log( "list of keys: ", listOfKeys);
    let columns=[];
    for (let i = 0; i < listOfKeys.length; i++){
        columns.push(
            {
                "field" : listOfKeys[i], 
                filter: true, 
                sortable: true, 
            }
        )
    }
    return columns;
}

function extractNameAndCurrency(country){


        const officialName = country.name.common;

        console.log("country.currencies", officialName+': '+country.countries);
        let currencyName;
        let currencyCode;

        if(!country.currencies){
            currencyName="no official currency";
        }
        else{
            currencyCode =  Object.keys(country.currencies)[0];
            console.log("currency code: ", currencyCode);
            currencyName =  country.currencies[currencyCode].name;
            console.log("currency name: ", currencyName) 
        }
      
        const flag = country.flags.svg;
        const population = country.population;
        console.log("country.languages", officialName+': '+country.languages);
        let languages;
        if(!country.languages){
            languages =  "no official langauges"
        }
        else{
            languages = Object.values(country.languages);
        }
        

        return{
            name: officialName, 
            currency: currencyName, 
            flag: flag, 
            population: population, 
            languages: languages
        }
    
}

function fetchCountryData(response){
    let countries=response.data;
    console.log("countries: ", countries);
    let namesAndCurrencies = countries.map(extractNameAndCurrency);
    namesAndCurrencies = namesAndCurrencies.filter(
        function(element){
            return element !== undefined;
        }
    );
    console.log("names and currencies: ", namesAndCurrencies);
    return namesAndCurrencies;   

}

export async function fetchCountries(){
    let config = {
        method: 'get', 
        maxBodyLength: Infinity, 
        url: 'https://restcountries.com/v3.1/all', 
        headers: {}
    };

    let response = await axios.request(config);
    
    let namesAndCurrencies=fetchCountryData(response);
    const columns=columnDefs(namesAndCurrencies);
    console.log("names and currencies: ", namesAndCurrencies);
  
    console.log("response: ", response.data);
    console.log("keys: ", columns);
    
    return {
        'countries':namesAndCurrencies, 
        'keys': columns
    };
};
