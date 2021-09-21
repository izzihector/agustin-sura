import React from 'react';
import SidebarElement from './SidebarElement';

const Sidebar = () => (
      <ul className="sidebar navbar-nav">
        <SidebarElement
          id="homepage-list-item"
          url="/iva/"
          icon="fas fa-fw fa-tachometer-alt"
          text="Inicio"
        />
        <SidebarElement
          id="customer-list-item"
          url="/iva/customers"
          icon="fas fa-fw fa-chart-area"
          text="Consumidor final"
        />
        <SidebarElement
          id="taxpayer-list-item"
          url="/iva/taxpayers"
          icon="fas fa-fw fa-table"
          text="Contribuyente"
        />
        <SidebarElement
          id="vendor-list-item"
          url="/iva/vendors"
          icon="fas fa-fw fa-chart-line"
          text="Compras"
        />
      </ul>
);

export default Sidebar;