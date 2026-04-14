import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const Loading = () => (
    <div className="flex justify-center items-center h-screen text-primary text-xl">
        Loading...
    </div>
);

// Layout wrapper
const Layout = ({ children }) => {
    const location = useLocation();
    const hideNavbar = ['/login', '/signup'].includes(location.pathname);

    return (
        <div className="app-layout flex flex-col min-h-screen">
            {!hideNavbar && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!hideNavbar && <Footer />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Layout>
                        <Suspense fallback={<Loading />}>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />

                                {/* Protected Routes - Requires Login */}
                                <Route path="/cart" element={
                                    <ProtectedRoute>
                                        <Cart />
                                    </ProtectedRoute>
                                } />
                                <Route path="/checkout" element={
                                    <ProtectedRoute>
                                        <Checkout />
                                    </ProtectedRoute>
                                } />
                                <Route path="/account/orders" element={
                                    <ProtectedRoute>
                                        <Orders />
                                    </ProtectedRoute>
                                } />
                                <Route path="/account/settings" element={
                                    <ProtectedRoute>
                                        <Settings />
                                    </ProtectedRoute>
                                } />

                                {/* Admin Routes - Requires Admin Role */}
                                <Route path="/admin" element={
                                    <AdminRoute>
                                        <AdminDashboard />
                                    </AdminRoute>
                                } />
                            </Routes>
                        </Suspense>
                        <Toaster position="top-center" />
                    </Layout>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
