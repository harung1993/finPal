import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PieChart, DollarSign, Plus, Bell, Settings, Eye, EyeOff, ChevronRight } from 'lucide-react';

const MobileDashboard = () => {
  const [showBalances, setShowBalances] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));
  };

  const accounts = [
    { name: 'Chase Checking', balance: 4250.00, color: '#3b82f6', icon: <Wallet size={20} /> },
    { name: 'Savings', balance: 12840.50, color: '#22c55e', icon: <TrendingUp size={20} /> },
    { name: 'Credit Card', balance: -1240.00, color: '#ef4444', icon: <DollarSign size={20} /> }
  ];

  const recentTransactions = [
    { id: 1, name: 'Whole Foods', amount: -85.42, category: 'Food', color: '#10b981', date: 'Today' },
    { id: 2, name: 'Salary', amount: 5200.00, category: 'Income', color: '#22c55e', date: 'Today' },
    { id: 3, name: 'Netflix', amount: -15.99, category: 'Entertainment', color: '#8b5cf6', date: 'Yesterday' },
    { id: 4, name: 'Shell Gas', amount: -52.30, category: 'Transport', color: '#ef4444', date: 'Yesterday' }
  ];

  const budgets = [
    { category: 'Food', spent: 550, budget: 700, color: '#10b981' },
    { category: 'Transport', spent: 420, budget: 500, color: '#ef4444' },
    { category: 'Shopping', spent: 540, budget: 400, color: '#f59e0b' }
  ];

  const netWorth = 15850.50;
  const monthlyIncome = 5200.00;
  const monthlyExpenses = 3920.00;

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '428px',
      height: '926px',
      margin: '0 auto',
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      overflow: 'auto',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
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
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '4px',
              background: 'linear-gradient(to right, #86efac, #fbbf24)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              💰 Dashboard
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Welcome back!</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setShowBalances(!showBalances)}
              style={{ 
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white'
              }}>
              {showBalances ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button style={{ 
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}>
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Net Worth Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.2), rgba(17, 24, 39, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(21, 128, 61, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#86efac', fontSize: '14px', marginBottom: '8px' }}>Net Worth</p>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
            {showBalances ? formatCurrency(netWorth) : '••••••'}
          </h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Income</p>
              <p style={{ color: '#22c55e', fontSize: '16px', fontWeight: '600' }}>
                {showBalances ? formatCurrency(monthlyIncome) : '••••'}
              </p>
            </div>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Expenses</p>
              <p style={{ color: '#ef4444', fontSize: '16px', fontWeight: '600' }}>
                {showBalances ? formatCurrency(monthlyExpenses) : '••••'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { icon: <Plus size={20} />, label: 'Add', color: '#15803d' },
            { icon: <TrendingUp size={20} />, label: 'Income', color: '#22c55e' },
            { icon: <TrendingDown size={20} />, label: 'Expense', color: '#ef4444' },
            { icon: <PieChart size={20} />, label: 'Budget', color: '#8b5cf6' }
          ].map((action, idx) => (
            <button key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: action.color
            }}>
              {action.icon}
              <span style={{ fontSize: '12px', color: 'white' }}>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Accounts */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>Accounts</h3>
            <button style={{ color: '#86efac', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {accounts.map((account, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `${account.color}20`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: account.color
                  }}>
                    {account.icon}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: '15px', fontWeight: '500', margin: 0, marginBottom: '2px' }}>
                      {account.name}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                      {account.balance < 0 ? 'Credit' : 'Balance'}
                    </p>
                  </div>
                </div>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: account.balance < 0 ? '#ef4444' : 'white',
                  margin: 0
                }}>
                  {showBalances ? formatCurrency(account.balance) : '••••'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Overview */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>Budgets</h3>
            <button style={{ color: '#86efac', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgets.map((budget, idx) => {
              const percentage = (budget.spent / budget.budget) * 100;
              const isOver = percentage >= 100;
              return (
                <div key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{budget.category}</span>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(percentage, 100)}%`,
                      height: '100%',
                      background: isOver ? '#ef4444' : percentage >= 80 ? '#f59e0b' : budget.color,
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 }}>Recent</h3>
            <button style={{ color: '#86efac', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentTransactions.map((txn) => (
              <div key={txn.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `${txn.color}20`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {txn.amount > 0 ? '💰' : '💳'}
                  </div>
                  <div>
                    <p style={{ color: 'white', fontSize: '15px', fontWeight: '500', margin: 0, marginBottom: '2px' }}>
                      {txn.name}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                      {txn.category} • {txn.date}
                    </p>
                  </div>
                </div>
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  color: txn.amount > 0 ? '#22c55e' : 'white',
                  margin: 0
                }}>
                  {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '428px',
        height: '80px',
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: '20px'
      }}>
        {[
          { icon: <PieChart size={24} />, label: 'Home', active: true },
          { icon: <DollarSign size={24} />, label: 'Transactions', active: false },
          { icon: <TrendingUp size={24} />, label: 'Budgets', active: false },
          { icon: <Settings size={24} />, label: 'Settings', active: false }
        ].map((item, idx) => (
          <button key={idx} style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            color: item.active ? '#86efac' : '#64748b'
          }}>
            {item.icon}
            <span style={{ fontSize: '11px' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileDashboard;