import React from 'react';
import InvoiceList from './InvoiceList';

export default class VendorPage extends React.Component{
    constructor(props){
        super(props);
    }
    toggleActive(){
        const item = document.getElementById("vendor-list-item");
        item.classList.toggle("active");
    }
    componentDidMount(){
        const breadcumb = document.getElementById("breadcumb-item");
        breadcumb.innerText = "Compras"
        this.toggleActive();
    }
    componentWillUnmount(){
        this.toggleActive();
    }
    render(){
        return (
            <div>
                <InvoiceList journal_id={9} report_url={`http://${window.location.hostname}/api/vendors/`} report_title={"LIBRO DE COMPRAS"}/>
            </div>
        );
    }
}
