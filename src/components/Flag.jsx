import React from 'react';

export default function Flag({url, country}){
    return (<img src={url} alt={`Flag of ${country}`} style={{width: '60px', height: '40px'}}/>);
}