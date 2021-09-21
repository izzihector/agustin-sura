import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import NotFoundPage from '../components/NotFoundPage';
import CustomerPage from '../components/CustomerPage';
import TaxpayerPage from '../components/TaxpayerPage';
import VendorPage from '../components/VendorPage';
import HomePage from '../components/HomePage';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Breadcumbs from '../components/Breadcumbs';
import Footer from '../components/Footer';
import SalesDetailPage from '../components/SalesDetailPage';

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Navbar />
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper">
                    <div className="container-fluid">
                    <Breadcumbs />
                    <Switch>
                        <Route path="/iva/" component={HomePage} exact={true} />
                        <Route path="/iva/customers" component={CustomerPage} />
                        <Route path="/iva/vendors" component={VendorPage} />
                        <Route path="/iva/taxpayers" component={TaxpayerPage} />
                        <Route path="/iva/cierre-de-caja" component={SalesDetailPage} />
                        <Route component={NotFoundPage} />
                    </Switch>
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        </div>
    </BrowserRouter>
);

export default AppRouter;