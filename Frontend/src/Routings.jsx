import React, {lazy, Suspense} from 'react';
import Loading from "./components/loading.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import Logout from "./pages/logout.jsx";

// Replace regular imports with lazy imports
const Login = lazy(() => import("./pages/Auth/login.jsx"));
const Register = lazy(() => import("./pages/Auth/register.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const Products = lazy(() => import("./pages/products.jsx"));
const About = lazy(() => import("./pages/about.jsx"));
const Contact = lazy(() => import("./pages/contact.jsx"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    // Replace this with your actual authentication logic
    const {isAuthenticated} = useSelector(state => state.auth);

    console.log("Is Authenticated", isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace state={{ from: window.location.pathname }} />;
    }


    return children;
};
const LogoutProtectedRoute = ({ children }) => {
    // Replace this with your actual authentication logic
    const {isAuthenticated} = useSelector(state => state.auth);


    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }


    return children;
};


function Routings(props) {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
                <Route path="/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/logout" element={<LogoutProtectedRoute><Logout /></LogoutProtectedRoute>} />
            </Routes>
        </Suspense>
    );
}

export default Routings;