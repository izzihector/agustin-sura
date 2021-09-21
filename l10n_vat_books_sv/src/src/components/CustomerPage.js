import React from 'react';
import InvoiceList from './InvoiceList';

export default class CustomerPage extends React.Component
{
    constructor(props){
        super(props);
    }
    toggleActive(){
        const item = document.getElementById("customer-list-item");
        item.classList.toggle("active");
    }
    componentDidMount(){
        const breadcumb = document.getElementById("breadcumb-item");
        breadcumb.innerText = "Ventas a consumidor final"
        this.toggleActive();
    }
    componentWillUnmount(){
        this.toggleActive();
    }
    render(){
        return (
            <div>
                <InvoiceList journal_id={1} report_url={`http://${window.location.hostname}/api/customers/`} report_title={"LIBRO DE VENTAS A CONSUMIDORES FINALES"}/>
            </div>
        );
    }
}
