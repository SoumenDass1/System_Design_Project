import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut,
    TrendingUp, DollarSign, Box
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        recentOrders: []
    });

    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/admin/stats');
            setDashboardData({
                totalSales: data.totalSales || 0,
                totalOrders: data.totalOrders || 0,
                totalProducts: data.totalProducts || 0,
                totalUsers: data.totalUsers || 0,
                recentOrders: data.recentOrders || []
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const stats = [
        { title: 'Total Sales', value: formatCurrency(dashboardData.totalSales), icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { title: 'Total Orders', value: dashboardData.totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
        { title: 'Total Products', value: dashboardData.totalProducts.toString(), icon: Box, color: 'bg-purple-100 text-purple-600' },
        { title: 'Total Users', value: dashboardData.totalUsers.toString(), icon: Users, color: 'bg-orange-100 text-orange-600' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === id
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
                </div>
                <nav className="px-4 space-y-2">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem id="products" icon={Package} label="Products" />
                    <SidebarItem id="orders" icon={ShoppingCart} label="Orders" />
                    <SidebarItem id="users" icon={Users} label="Users" />
                    <SidebarItem id="settings" icon={Settings} label="Settings" />
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Admin</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-green-500 text-sm font-medium flex items-center">
                                    <TrendingUp size={16} className="mr-1" /> +12%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <button className="text-primary text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashboardData.recentOrders.length > 0 ? (
                                    dashboardData.recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.user?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(order.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{formatCurrency(order.total)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No orders yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
