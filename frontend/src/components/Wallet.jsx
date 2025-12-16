import React, { useState } from 'react';
import { FiDollarSign, FiClock, FiPlusCircle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect } from 'react';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE;
const Wallet = ({ user, onAddFunds }) => {
    const [amount, setAmount] = useState(1000);
    const [isAdding, setIsAdding] = useState(false);

    const walletHistory = [
        { date: 'Jan', balance: 45000 },
        { date: 'Feb', balance: 42000 },
        { date: 'Mar', balance: 48000 },
        { date: 'Apr', balance: 46000 },
        { date: 'May', balance: 50000 },
        // { date: 'Jun', balance: user.walletBalance },
        { date: 'Jun', balance: user.walletBalance ?? 0 },
    ];

    const [recentTransactions, setRecentTransactions] = useState([]);
    useEffect(() => {
        if (!user?.id) return;

        const fetchTransactions = async () => {
            try {
                const res = await axios.get(`${API_BASE}/${user.id}`);
                setRecentTransactions(res.data.history);
            } catch (err) {
                console.error("Failed to fetch wallet", err.response?.status, err.response?.data);
            }
        };

        fetchTransactions();
    }, [user]);

    const handleAddFunds = async () => {
        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setIsAdding(true);
        const success = await onAddFunds(amount);
        setIsAdding(false);

        if (success) {
            setAmount(1000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto fade-in">
            <h1 className="text-3xl font-bold text-purple-900 mb-8">
                <FiDollarSign className="inline mr-3" />
                My Wallet
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="card mb-8">
                        <h2 className="text-xl font-bold text-purple-900 mb-6">
                            Wallet Balance History
                        </h2>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={walletHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E9D8FD" />
                                    <XAxis dataKey="date" stroke="#6B46C1" />
                                    <YAxis stroke="#6B46C1" />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#6B46C1',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#9F7AEA"
                                        strokeWidth={3}
                                        dot={{ stroke: '#6B46C1', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: '#6B46C1' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card-purple card mb-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-4">₹{user.walletBalance.toLocaleString()}</div>
                            <p className="text-purple-200">Current Wallet Balance</p>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold text-purple-900 mb-6">
                            <FiPlusCircle className="inline mr-3" />
                            Add Funds
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-2">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                    min="100"
                                    step="100"
                                    className="input-field"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[500, 1000, 2000, 5000].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt)}
                                        className={`amount-btn border-2 transition-all ${amount === amt
                                                ? 'active'
                                                : 'border-purple-400 text-purple-600 hover:border-purple-600'
                                            }`}
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleAddFunds}
                                disabled={isAdding}
                                className="btn-primary w-full"
                            >
                                {isAdding ? (
                                    <>
                                        <span className="animate-spin inline-block mr-2">⟳</span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiPlusCircle className="inline mr-2" />
                                        Add ₹{amount} to Wallet
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="card mt-8">
                        <h3 className="font-bold text-purple-900 mb-4">Quick Tips</h3>
                        <ul className="space-y-3 text-sm text-purple-600">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500">•</span>
                                Minimum top-up amount is ₹100
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500">•</span>
                                Funds are added instantly
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500">•</span>
                                Wallet balance never expires
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500">•</span>
                                Get 5% bonus on ₹5000+ top-ups
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;