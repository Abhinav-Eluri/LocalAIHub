import React, {lazy, Suspense} from 'react';
import Loading from "./components/loading.jsx";
import {Route, Routes} from "react-router-dom";

// Replace regular imports with lazy imports
const Login = lazy(() => import("./pages/Auth/login.jsx"));
const Register = lazy(() => import("./pages/Auth/register.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const Products = lazy(() => import("./pages/products.jsx"));
const About = lazy(() => import("./pages/about.jsx"));
const Contact = lazy(() => import("./pages/contact.jsx"));


function Routings(props) {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Suspense>
    );
}

export default Routings;