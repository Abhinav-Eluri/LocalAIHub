import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from './redux/store'


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <StrictMode>
                <App/>
            </StrictMode>
        </BrowserRouter>
    </Provider>
)
