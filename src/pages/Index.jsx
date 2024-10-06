/* eslint-disable no-this-before-super */
import React, {Component} from 'react';
import { fetchCountries } from '../data/fetchCountries';

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
        this.setState({ selectedRows });
        console.log("selected rows: ", selectedRows);
    }


    render(){
        const{loading, countries, columns, selectedRows}=this.state;
        console.log("countries state: ", this.state.countries);
        console.log("selected countries: ", selectedRows);
        if (!loading){
            return(
                <div className="ag-theme-quartz" style={{height:800}}>
                    <AgGridReact 
                        rowData={countries} 
                        columnDefs={columns} 
                        pagination={true} 
                        paginationPageSize={100} 
                        paginationPageSizeSelector={[100, 200, 300]}
                        rowSelection={{mode:'multiRow', selectAll: 'filtered'}}
                        onSelectionChanged={this.handleSelectionChanged}
                        onGridReady={this.onGridReady}
                    />
                </div>
            );
        }
        
    }
}

export default Index;