import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router/AppRouter';
import './style/app.css';

const jsx = (
        <AppRouter />
);

ReactDOM.render(jsx, document.getElementById('app'));