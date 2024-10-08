/* eslint-disable no-this-before-super */
import React, {Component} from 'react';
import { fetchCountries } from '../data/fetchCountries';

import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import Flag from '../components/Flag';


class MainPage extends Component{
    constructor(){
        super();
        let storedSelectedCountry;
        try{
            storedSelectedCountry = localStorage.getItem('selectedCountry');
            storedSelectedCountry =JSON.parse(storedSelectedCountry);
        }
        catch(error){
            storedSelectedCountry=null
        }
        console.log('local storage country: ', storedSelectedCountry);
        console.log('local stroage country type: ', typeof(storedSelectedCountry));
        this.state={
            columns:[],
            countries:[],
            loading:true,
            selectedRows:[],
            selectedCountry: storedSelectedCountry
        }
    }

    async componentDidUpdate(prevProps, prevState){
        if(prevState.selectedCountry !== this.state.selectedCountry){
            localStorage.setItem('selectedCountry', JSON.stringify(this.state.selectedCountry));
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
        localStorage.setItem('selectedCountry', this.state.selectedCountry);
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
        let selectedCountry = this.gridApi.getSelectedRows();
        if(selectedCountry.length >0){
            selectedCountry =selectedCountry.pop();
        }
        else{
            selectedCountry = null
        }
 
        this.setState({ 
            selectedCountry: selectedCountry, 
        });
        

    }


    render(){
        const{loading, countries, columns, selectedCountry}=this.state;


        console.log("selected nation state: ", selectedCountry);
        if (!loading){
            //console.log("selected country: ", selectedCountry.pop());
            return(
                <div className="flex flex-col justify-center items-center space-y-4">
                    {
                   
                        (selectedCountry )&&(
                            <div className="border-2 rounded-lg border-blue-400 bg-blue-200 px-8 py-4 d-flex space-y-2">
                                <h1 className="text-2xl">The selected country is <b>{selectedCountry.name}</b></h1>
                                <ul className="justify-center items-center">
                                    {(selectedCountry['capital city'] && selectedCountry['capital city'].length>1)?
                                        (<li>Their capital cities are: <b>{selectedCountry['capital city'].slice(0, -1).join(" , ") + ", and "+selectedCountry['capital city'][selectedCountry['capital city'].length-1]}</b></li>):
                                        (!selectedCountry['capital city'])?
                                        (<li> There is no official capital city here</li>):
                                        (<li>The capital city is <b>{selectedCountry['capital city'][0]}</b>.</li>)
                                    }
                                    <li>{selectedCountry.name} has a population of <b>{selectedCountry.population}</b> people.</li>
                                    {selectedCountry.currency === "no official currency"?
                                    (<li>{selectedCountry.name} has no official currency</li>)
                                    :
                                    (<li>{selectedCountry.name} uses the <b>{selectedCountry.currency}</b> as their currency.</li>)
                                    }
                                    
                                    {selectedCountry.languages  ?
                                        selectedCountry.languages.length > 1? 
                                        (<li>Their official languages are <b>{selectedCountry.languages.slice(0, -1).join(", ")+ " and "+selectedCountry.languages[selectedCountry.languages.length-1]}</b></li>)
                                        :
                                        (<li>Their official language is <b>{selectedCountry.languages[0]}</b>.</li>)
                                        :
                                        (<li>{selectedCountry.name} <b>has no official languages</b></li>)
                                    }
                                    <li>And their national flag is: <Flag url={selectedCountry.flag} country={selectedCountry.name}/></li>
                                    
                                </ul>
                            </div>
                        )
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

export default MainPage;