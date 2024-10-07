/* eslint-disable no-this-before-super */
import React, {Component} from 'react';
import { fetchCountries } from '../data/fetchCountries';
import { fetchCountry } from '../data/fetchCountry';

import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";


class Index extends Component{
    constructor(){
        super();
        this.state={
            columns:[],
            countries:[],
            loading:true,
            selectedRows:[],
            selectedCountry:[]
        }
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevState.selectedCountry !== this.state.selectedCountry && this.state.selectedCountry.length !== 0){
            let data= await fetchCountry(this.state.selectedCountry[0]);
            console.log("country data: ", data);
        }
    }

    async componentDidMount(){ //fetches country on first mount to the DOM
        let countries = await fetchCountries();
        this.setState({
            columns: countries.keys,
            countries: countries.countries, 
            loading: false
        });
        const savedCountries = localStorage.getItem('selectedRows');

        if(savedCountries){
            console.log("saved countries before parse: ", savedCountries);
            this.setState({
                selectedRows: JSON.parse(savedCountries)
            });
            console.log('Countries retrieved from localStorage:', JSON.parse(savedCountries));
        }else{
            console.log("no countries found in local storage");
        }
      
    }

    componentWillUnmount(){
        localStorage.setItem('selectedRows', this.state.selectedRows);
    }

    onGridReady = (params) =>{
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        // Restore selection after grid is ready
        if (this.state.selectedRows.length > 0) {
            this.gridApi.forEachNode((node) => {
                if (this.state.selectedRows.some(row => row.name === node.data.name)) {
                    node.setSelected(true); // Select the node if it matches the saved selected rows
                }
            });
        }
    };

    handleSelectionChanged = () =>{
        const selectedRows = this.gridApi.getSelectedRows();
        const selectedCountry=selectedRows.map(country => country.name);
        this.setState({ selectedRows, selectedCountry });
        console.log("selected rows: ", selectedRows);
        console.log("Selected country names: ", selectedCountry);
    }


    render(){
        const{loading, countries, columns, selectedRows, selectedCountry}=this.state;
        console.log("countries state: ", this.state.countries);
        console.log("selected countries: ", selectedRows);
        if (!loading){
            //console.log("selected country: ", selectedCountry.pop());
            return(
                <div>
                    {
                        (selectedCountry[0])&&
                            <div>
                                <h1 className="text-3xl font-bold">The selected country is {selectedCountry[0]}</h1>
                            </div>
                        
                    }
                
                    <div className="ag-theme-quartz" style={{height:800}}>
                        <AgGridReact 
                            rowData={countries} 
                            columnDefs={columns} 
                            pagination={true} 
                            paginationPageSize={100} 
                            paginationPageSizeSelector={[100, 200, 300]}
                            rowSelection={{mode:'singleRow', selectAll: 'filtered'}}
                            onSelectionChanged={this.handleSelectionChanged}
                            onGridReady={this.onGridReady}
                        />
                    </div>
                </div>
            );
        }
        
    }
}

export default Index;