import React, { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';
import '../css/Invoice.css';

const InvoiceModal = ({ order, onClose }) => {
    const invoiceRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    if (!order) return null;

    return (
        <div className="invoice-overlay">
            <div className="invoice-modal">
                <div className="invoice-actions">
                    <button onClick={handlePrint} className="btn-icon" title="Print Invoice">
                        <Printer size={20} />
                    </button>
                    <button onClick={onClose} className="btn-icon" title="Close">
                        <X size={24} />
                    </button>
                </div>

                <div className="invoice-content" ref={invoiceRef}>
                    {/* Header */}
                    <div className="invoice-header">
                        <div className="brand-logo">
                            <h2>THEBRAND.</h2>
                        </div>
                        <div className="invoice-details">
                            <h1>INVOICE</h1>
                            <p><strong>Invoice #:</strong> {order.id}</p>
                            <p><strong>Date:</strong> {order.date}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                        </div>
                    </div>

                    {/* Bill To / Ship To */}
                    <div className="invoice-addresses">
                        <div className="address-block">
                            <h3>Bill To:</h3>
                            <p>{order.fullName}</p>
                            <p>{order.email}</p>
                            <p>{order.phone}</p>
                        </div>
                        <div className="address-block">
                            <h3>Ship To:</h3>
                            <p>{order.addressLine1}</p>
                            {order.addressLine2 && <p>{order.addressLine2}</p>}
                            <p>{order.city}, {order.zipCode}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th className="text-center">Size</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Price</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="item-info">
                                            <span>{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-center">{item.size}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-right">${item.price.toFixed(2)}</td>
                                    <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="invoice-footer">
                        <div className="invoice-totals">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className="total-row">
                                <span>Tax (10%):</span>
                                <span>${(order.total * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total:</span>
                                <span>${(order.total * 1.1).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-note">
                        <p>Thank you for your business!</p>
                        <p className="text-muted text-sm">For any questions, please contact support@thebrand.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
