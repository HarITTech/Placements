import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';  // Import Provider
import { store, persistor } from "./redux/store";  // Import your Redux store
import { PersistGate } from 'redux-persist/integration/react';

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with Provider to pass the Redux store
root.render(
    <Provider store={store}>  {/* Wrap App with Provider and pass the store */}
      <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
