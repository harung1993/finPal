import React, { useState } from 'react';
import { X, Calendar, DollarSign, Tag, Wallet, ChevronRight } from 'lucide-react';

const MobileAddTransaction = () => {
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('Chase Checking');

  const categories = {
    expense: [
      { id: 1, name: 'Food & Dining', icon: '🍔', color: '#10b981' },
      { id: 2, name: 'Transportation', icon: '🚗', color: '#ef4444' },
      { id: 3, name: 'Shopping', icon: '🛍️', color: '#f59e0b' },
      { id: 4, name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
      { id: 5, name: 'Utilities', icon: '⚡', color: '#14b8a6' },
      { id: 6, name: 'Healthcare', icon: '💊', color: '#ec4899' }
    ],
    income: [
      { id: 7, name: 'Salary', icon: '💰', color: '#22c55e' },
      { id: 8, name: 'Freelance', icon: '💼', color: '#3b82f6' },
      { id: 9, name: 'Investment', icon: '📈', color: '#8b5cf6' }
    ]
  };

  const accounts = [
    { name: 'Chase Checking', balance: 4250.00 },
    { name: 'Savings Account', balance: 12840.50 },
    { name: 'Credit Card', balance: -1240.00 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleNumberInput = (num) => {
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleDelete = () => {
    setAmount(amount.slice(0, -1) || '0');
  };

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '428px',
      height: '926px',
      margin: '0 auto',
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      overflow: 'auto',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Status Bar */}
      <div style={{ 
        height: '44px',
        background: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        color: 'white',
        fontSize: '14px'
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>
          <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>
          <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>
        </div>
      </div>

      {/* Header */}
      <div style={{ 
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}>
            <X size={24} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>
            Add Transaction
          </h1>
          <div style={{ width: '40px' }}></div>
        </div>
      </div>

      {/* Type Selector */}
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '6px',
          borderRadius: '12px'
        }}>
          <button
            onClick={() => setTransactionType('expense')}
            style={{
              padding: '12px',
              background: transactionType === 'expense' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              border: transactionType === 'expense' ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
              borderRadius: '8px',
              color: transactionType === 'expense' ? '#ef4444' : '#94a3b8',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Expense
          </button>
          <button
            onClick={() => setTransactionType('income')}
            style={{
              padding: '12px',
              background: transactionType === 'income' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
              border: transactionType === 'income' ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
              borderRadius: '8px',
              color: transactionType === 'income' ? '#22c55e' : '#94a3b8',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Income
          </button>
        </div>
      </div>

      {/* Amount Display */}
      <div style={{ 
        padding: '20px 20px 30px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>Amount</p>
        <h2 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: transactionType === 'income' ? '#22c55e' : 'white',
          margin: 0
        }}>
          ${amount || '0'}
        </h2>
      </div>

      {/* Form Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
            Description
          </label>
          <input
            type="text"
            placeholder="What did you buy?"
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              outline: 'none'
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
            Category
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {categories[transactionType].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '16px 8px',
                  background: selectedCategory === cat.id ? `${cat.color}20` : 'rgba(255, 255, 255, 0.05)',
                  border: selectedCategory === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                <span style={{ 
                  fontSize: '11px', 
                  color: selectedCategory === cat.id ? cat.color : '#94a3b8',
                  fontWeight: selectedCategory === cat.id ? '600' : '400',
                  textAlign: 'center',
                  wordWrap: 'break-word'
                }}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Account Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
            Account
          </label>
          <button style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <Wallet size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: 'white', fontSize: '15px', fontWeight: '500', margin: 0 }}>
                  {selectedAccount}
                </p>
                <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                  {formatCurrency(accounts.find(a => a.name === selectedAccount)?.balance || 0)}
                </p>
              </div>
            </div>
            <ChevronRight size={20} color="#64748b" />
          </button>
        </div>

        {/* Date Picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
            Date
          </label>
          <button style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={20} color="#64748b" />
              <span style={{ color: 'white', fontSize: '15px' }}>Today, Jan 15, 2025</span>
            </div>
            <ChevronRight size={20} color="#64748b" />
          </button>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
            Tags (Optional)
          </label>
          <button style={{
            width: '100%',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '14px'
          }}>
            <Tag size={18} /> Add Tags
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ 
        padding: '20px',
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button style={{
          width: '100%',
          padding: '18px',
          background: '#15803d',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '17px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <DollarSign size={20} /> Save Transaction
        </button>
      </div>

      {/* Number Pad Overlay (Optional - can be toggled) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '428px',
        background: 'rgba(17, 24, 39, 0.98)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px',
        display: 'none' // Toggle this based on amount input focus
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
            <button
              key={key}
              onClick={() => key === '⌫' ? handleDelete() : handleNumberInput(key)}
              style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '24px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileAddTransaction;