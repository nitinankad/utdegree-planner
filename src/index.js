import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from "styled-components";
import App from './components/App';

const Style = createGlobalStyle`
    html {
        font-family: 'Fira Sans',OpenSans,Arial,sans-serif;
    }
`;

ReactDOM.render(
    <div>
        <Style />
        <App />
    </div>
, document.getElementById('root'));