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
            selectedRow: null,
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

    onRowSelected = (event) => {
        const selectedRow = event.node.isSelected() ? event.data : null;
        this.setState({selectedRow});
    }; 

    onRowSelectionChanged = (event) => {
        const selectedRows = event.api.getSelectedRows();
        this.setState({ selectedRow: selectedRows[0] });
    };

    render(){
        const{loading, countries, columns}=this.state;
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
                        onRowSelected={this.onRowSelected}
                        onSelectionChanged={this.onRowSelectionChanged}
                    />
                </div>
            );
        }
        
    }
}

export default Index;