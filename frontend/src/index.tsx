import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import 'bootstrap/dist/css/bootstrap.css'; 
import store, { selectChatStore }  from './redux/store';
import { Provider as ReduxProvider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
        <ReduxProvider store={store}>
		    <App />
        </ReduxProvider>
	</React.StrictMode>
);