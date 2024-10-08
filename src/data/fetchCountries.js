import axios from 'axios';
import Flag from '../components/Flag';

function numberStringComparator(valA, valB){//for sorting number strings.
    const A = parseInt(valA.replace(/,/g, ''), 10);
    const B = parseInt(valB.replace(/,/g, ''), 10);
    return A-B;
}


function columnDefs(response){

    response=response.filter(
        function(element){
            return element !== undefined;
        }
    );
 
    const listOfKeys = response.map(obj => Object.keys(obj))[0];

    let columns=[];
    for (let i = 0; i < listOfKeys.length; i++){
        if(listOfKeys[i] === "flag"){
            columns.push({
                "field" : "flag", 
                filter: false, 
                sortable: false, 
                floatingFilter: false, 
                cellRenderer: (params) => (
                    <Flag url={params.value} country={params.data.name}/>
                ),
            })
        }
        else if(listOfKeys[i] === 'population'){
            columns.push({
                'field': 'population', 
                filter: true, 
                comparator: numberStringComparator,
            })
        }
   
        else{
            columns.push(
                {
                    "field" : listOfKeys[i], 
                    filter: true, 
                    sortable: true, 
                    floatingFilter: true
                }
        
            )
        }
    }
    return columns;
}

function extractNameAndCurrency(country){


        const officialName = country.name.common;


        let currencyName;
        let currencyCode;

        if(!country.currencies){
            currencyName="no official currency";
        }
        else{
            currencyCode =  Object.keys(country.currencies)[0];
 
            currencyName =  country.currencies[currencyCode].name;

        }
      
        const flag = country.flags.svg;
        const population = country.population.toLocaleString();

        let languages;
        if(!country.languages){
            languages =  "no official langauges"
        }
        else{
            languages = Object.values(country.languages);
        }

        const capital = country.capital;
        

        return{
            name: officialName, 
            'capital city': capital,
            currency: currencyName, 
            flag: flag, 
            population: population, 
            languages: languages,  
        }
    
}

function fetchCountryData(response){
    let countries=response.data;

    let namesAndCurrencies = countries.map(extractNameAndCurrency);
    namesAndCurrencies = namesAndCurrencies.filter(
        function(element){
            return element !== undefined;
        }
    );

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

    
    return {
        'countries':namesAndCurrencies, 
        'keys': columns
    };
};
