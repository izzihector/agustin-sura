import React from 'react';
import {NavLink} from 'react-router-dom';

const Header = () => (
    <header>
        <h1>Libros de IVA</h1>
        <NavLink to="/iva/">Inicio</NavLink>
        <NavLink to="/iva/customers">Ventas a consumidor final</NavLink>
        <NavLink to="/iva/vendors">Compras internas</NavLink>
        <NavLink to="/iva/taxpayers">Ventas a contribuyentes</NavLink>
    </header>
);

export default Header;