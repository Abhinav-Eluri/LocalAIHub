import React, { lazy, Suspense } from 'react';
import './App.css';
import NavBar from "./components/navbar.jsx";
import { useLocation } from 'react-router-dom';
import Routings from "./Routings.jsx";

function App() {
    const location = useLocation();
    const noNavbarRoutes = ['/badminton/home', '/badminton/create'];
    const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && <NavBar />}
            <Routings />
        </>
    );
}

export default App;