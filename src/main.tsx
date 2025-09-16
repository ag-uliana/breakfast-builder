import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderProvider } from './state/order';
import App from './App';
import './styles/global.css';

const qc = new QueryClient();
const basename = import.meta.env.DEV ? '/' : import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <OrderProvider> 
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </OrderProvider> 
    </QueryClientProvider>
  </React.StrictMode>
);
