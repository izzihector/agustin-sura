import React from 'react';

export default class HomePage extends React.Component{
    constructor(props){
        super(props);

    }
    componentDidMount(){
        const breadcumb_item = document.getElementById("breadcumb-item");
        breadcumb_item.innerText = "Inicio";
        const homePageListItem = document.getElementById("homepage-list-item");
        homePageListItem.classList.toggle("active");
    }
    componentWillUnmount(){
        const homePageListItem = document.getElementById("homepage-list-item");
        homePageListItem.classList.toggle("active");
    }
    render(){
        return(
            <div>
                <h1>Bienvenidos</h1>
            </div>
        )
    }
}