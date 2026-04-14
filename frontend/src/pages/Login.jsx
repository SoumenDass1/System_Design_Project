import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import '../css/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(formData.email, formData.password);
        if (success) {
            navigate('/');
        }
        setIsLoading(false);
    };

    return (
        <div className="auth-page">
            {/* Left Side - Image */}
            <div className="auth-image-side">
                <div className="auth-image-overlay"></div>
                <img
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1950&q=80"
                    alt="Fashion"
                />
                <div className="auth-image-content">
                    <h2>Welcome Back</h2>
                    <p>We're so excited to see you again!</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-form-side">
                <Link to="/" className="back-home">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <div className="auth-content">
                    <div className="auth-header">
                        <h1>Sign In</h1>
                        <p>Welcome back! Please enter your details.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <Mail size={20} className="input-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={20} className="input-icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full btn-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        <div className="social-login">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    setIsLoading(true);
                                    await googleLogin(credentialResponse.credential);
                                    navigate('/');
                                    setIsLoading(false);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                    setIsLoading(false);
                                }}
                                useOneTap
                                theme="outline"
                                size="large"
                                width="100%"
                            />
                        </div>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/signup" className="auth-link">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
