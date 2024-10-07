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
        const storedSelectedCountry = localStorage.getItem('selectedCountry');
        this.state={
            columns:[],
            countries:[],
            loading:true,
            selectedRows:[],
            selectedCountry: storedSelectedCountry || null
        }
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevState.selectedCountry !== this.state.selectedCountry){
            localStorage.setItem('selectedCountry', this.state.selectedCountry)
        }
    }

    async componentDidMount(){ //fetches country on first mount to the DOM
        let countries = await fetchCountries();
        this.setState({
            columns: countries.keys,
            countries: countries.countries, 
            loading: false
        });
      
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
        this.setState({ 
            selectedRows: selectedRows, 
            selectedCountry: selectedCountry[0] 
        });
        console.log("selected rows: ", selectedRows);
        console.log("Selected country names: ", selectedCountry);
    }


    render(){
        const{loading, countries, columns, selectedRows, selectedCountry}=this.state;
        console.log("countries state: ", this.state.countries);
        console.log("selected countries: ", selectedRows);
        console.log("selected nation state: ", selectedCountry);
        if (!loading){
            //console.log("selected country: ", selectedCountry.pop());
            return(
                <div className="flex flex-col justify-center items-center space-y-4">
                    {
                        (selectedCountry)&&
                            <div className="border-2 rounded-lg border-blue-400 bg-blue-200 px-8 py-4">
                                <h1 className="text-2xl font-bold">The selected country is {selectedCountry}</h1>
                            </div>
                        
                    }
                
                    <div className="ag-theme-quartz" style={{height:800, width:1300}}>
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