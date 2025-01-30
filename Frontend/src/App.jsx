import React, { lazy, Suspense } from 'react';
import './App.css'
import NavBar from "./components/navbar.jsx";
import Routings from "./Routings.jsx";

function App() {
    return (
        <>
            <NavBar/>
            <Routings />

        </>
    );
}

export default App;