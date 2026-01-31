import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import 'react-notifications-component/dist/theme.css'
import App from './App';
import Facilities from './MyLib/Components/Facilities';
import { ReactNotifications } from 'react-notifications-component';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactNotifications />
      <App />
      <Facilities/>
    </BrowserRouter>
  </React.StrictMode>
);

