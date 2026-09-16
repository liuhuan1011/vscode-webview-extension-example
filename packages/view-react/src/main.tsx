import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@arco-design/web-react/dist/css/arco.css';
import App from './App.tsx';
import './index.css';
import { JsonrpcClientContextProvider } from './contexts/jsonrpc-rx-context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JsonrpcClientContextProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </JsonrpcClientContextProvider>
  </React.StrictMode>,
);
