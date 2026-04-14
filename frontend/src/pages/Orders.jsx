import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import '../css/Orders.css';

import InvoiceModal from '../components/InvoiceModal';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            // Don't show toast on initial load error to avoid spam, or handle gracefully
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await api.put(`/orders/${orderId}/status`, { status: "Cancelled" });
                toast.success('Order cancelled successfully');
                fetchOrders(); // Refresh list
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to cancel order');
            }
        }
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'Processing': return 1;
            case 'Shipped': return 2;
            case 'Delivered': return 3;
            default: return 0;
        }
    };

    return (
        <div className="orders-page">
            <div className="orders-container">
                <div className="page-header">
                    <h1>My Orders</h1>
                    <p className="text-muted">Track and manage your recent orders.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package size={64} className="text-gray-300 mx-auto mb-4" />
                        <h3>No orders yet</h3>
                        <p className="text-muted mb-6">Looks like you haven't placed any orders yet.</p>
                        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => {
                            const currentStep = getStatusStep(order.status);
                            const isCancelled = order.status === 'Cancelled';

                            return (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <div className="info-group">
                                                <label>Order ID</label>
                                                <span>{order.id}</span>
                                            </div>
                                            <div className="info-group">
                                                <label>Date</label>
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="info-group">
                                                <label>Total Amount</label>
                                                <span>${order.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    {/* Tracking Progress */}
                                    {!isCancelled && (
                                        <div className="order-tracking">
                                            <div className="tracking-progress">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                                >
                                                    <div className="moving-truck">
                                                        <Truck size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tracking-steps">
                                                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                                    <div className="step-icon"><Clock size={16} /></div>
                                                    <span>Processing</span>
                                                </div>
                                                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                                    <div className="step-icon"><Truck size={16} /></div>
                                                    <span>Out for Delivery</span>
                                                </div>
                                                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                                                    <div className="step-icon"><CheckCircle size={16} /></div>
                                                    <span>Delivered</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="order-items">
                                        {order.items.map((item, idx) => {
                                            const product = item.product || {}; // Handle potential missing product
                                            return (
                                                <div key={idx} className="order-item">
                                                    <img src={product.image || 'https://via.placeholder.com/100'} alt={product.name} className="item-image" />
                                                    <div className="item-details">
                                                        <h4>{product.name || 'Unknown Product'}</h4>
                                                        <p className="item-meta">Size: {item.size || 'N/A'} | Qty: {item.quantity}</p>
                                                        <p className="item-price">${item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="order-actions">
                                        {!isCancelled && order.status !== 'Delivered' && (
                                            <button
                                                className="btn-outline-sm btn-danger"
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={order.status === 'Shipped'} // 'Shipped' maps to 'Out for Delivery' here
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <button
                                            className="btn-outline-sm"
                                            onClick={() => setSelectedInvoice(order)}
                                        >
                                            View Invoice
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Invoice Modal */}
            {selectedInvoice && (
                <InvoiceModal
                    order={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    );
};

export default Orders;
