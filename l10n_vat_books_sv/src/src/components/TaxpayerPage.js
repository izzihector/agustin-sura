import React from 'react';
import InvoiceList from './InvoiceList';

export default class TaxpayerPage extends React.Component
{
    constructor(props){
        super(props);
    }
    toggleActive(){
        const item = document.getElementById("taxpayer-list-item");
        item.classList.toggle("active");
    }
    componentDidMount(){
        const breadcumb = document.getElementById("breadcumb-item");
        breadcumb.innerText = "Ventas al contribuyente"
        this.toggleActive();
    }
    componentWillUnmount(){
        this.toggleActive();
    }
    render(){
        return (
            <div>
                <InvoiceList journal_id={2} customer_sales={1} report_url={`http://${window.location.hostname}/api/taxpayers/`} report_title={"LIBRO DE VENTAS A CONTRIBUYENTES"}/>
            </div>
        );
    }
} 
