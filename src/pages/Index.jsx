/* eslint-disable no-this-before-super */
import React, {Component} from 'react';
import { fetchCountries } from '../data/fetchCountries';

import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";

class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            columns:[],
            countries:[],
            loading:true,
            selectedRows:[],
        }
    }
    async componentDidMount(){
        let countries = await fetchCountries();
        this.setState({
            columns: countries.keys,
            countries: countries.countries, 
            loading: false
        });
    }

    onGridReady = (params) =>{
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    };

    handleSelectionChanged = () =>{
        const selectedRows = this.gridApi.getSelectedRows();
        this.setState({ selectedRows });
        console.log("selected rows: ", selectedRows);
    }


    render(){
        const{loading, countries, columns, selectedRows}=this.state;
        console.log("countries state: ", this.state.countries);
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