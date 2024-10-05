/* eslint-disable no-this-before-super */
import React, {Component} from 'react';
import { fetchCountries } from '../data/fetchCountries';

class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            countries:[]
        }
    }
    async componentDidMount(){
        let countries = await fetchCountries();
        this.setState({
            countries: countries
        });
    }

    render(){
        console.log("countries state: ", this.state.countries);
        return(
            <div>
                <h1>Index page</h1>
            </div>
        );
    }
}

export default Index;