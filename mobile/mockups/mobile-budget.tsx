import React, { useState } from 'react';
import { Plus, Target, AlertCircle, TrendingUp, ChevronLeft, Calendar } from 'lucide-react';

const MobileBudget = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const budgets = [
    { 
      id: 1, 
      category: 'Food & Dining', 
      budgeted: 700, 
      spent: 550, 
      color: '#10b981', 
      icon: '🍔',
      transactions: 24,
      daysLeft: 12
    },
    { 
      id: 2, 
      category: 'Transportation', 
      budgeted: 500, 
      spent: 420, 
      color: '#ef4444', 
      icon: '🚗',
      transactions: 18,
      daysLeft: 12
    },
    { 
      id: 3, 
      category: 'Shopping', 
      budgeted: 400, 
      spent: 540, 
      color: '#f59e0b', 
      icon: '🛍️',
      transactions: 12,
      daysLeft: 12
    },
    { 
      id: 4, 
      category: 'Entertainment', 
      budgeted: 300, 
      spent: 280, 
      color: '#8b5cf6', 
      icon: '🎬',
      transactions: 15,
      daysLeft: 12
    },
    { 
      id: 5, 
      category: 'Utilities', 
      budgeted: 250, 
      spent: 230, 
      color: '#14b8a6', 
      icon: '⚡',
      transactions: 5,
      daysLeft: 12
    },
    { 
      id: 6, 
      category: 'Healthcare', 
      budgeted: 200, 
      spent: 85, 
      color: '#ec4899', 
      icon: '💊',
      transactions: 3,
      daysLeft: 12
    }
  ];

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = (totalSpent / totalBudgeted) * 100;

  const getBudgetStatus = (spent, budgeted) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 100) return { label: 'Over Budget', color: '#ef4444' };
    if (percentage >= 80) return { label: 'Warning', color: '#f59e0b' };
    return { label: 'On Track', color: '#22c55e' };
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
      <div style={{ 
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 10
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
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>
            Budgets
          </h1>
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#15803d',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}>
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        {/* Period Selector */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '6px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedPeriod === period ? 'rgba(21, 128, 61, 0.2)' : 'transparent',
                border: selectedPeriod === period ? '1px solid rgba(21, 128, 61, 0.3)' : 'none',
                borderRadius: '8px',
                color: selectedPeriod === period ? '#86efac' : '#94a3b8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Overall Summary Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.2), rgba(17, 24, 39, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(21, 128, 61, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>Total Budgeted</p>
              <p style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
                {formatCurrency(totalBudgeted)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>Spent</p>
              <p style={{ color: overallPercentage >= 100 ? '#ef4444' : 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#cbd5e1', fontSize: '13px' }}>Overall Progress</span>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                {overallPercentage.toFixed(0)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(overallPercentage, 100)}%`,
                height: '100%',
                background: overallPercentage >= 100 ? '#ef4444' : overallPercentage >= 80 ? '#f59e0b' : '#22c55e',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Remaining</p>
              <p style={{ color: totalRemaining >= 0 ? '#22c55e' : '#ef4444', fontSize: '16px', fontWeight: '700', margin: 0 }}>
                {formatCurrency(Math.abs(totalRemaining))}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Days Left</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <Calendar size={14} color="#94a3b8" />
                <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '700', margin: 0 }}>12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.budgeted) * 100;
            const status = getBudgetStatus(budget.spent, budget.budgeted);
            const remaining = budget.budgeted - budget.spent;
            const isOverBudget = budget.spent > budget.budgeted;

            return (
              <div
                key={budget.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: `${budget.color}20`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {budget.icon}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0, marginBottom: '2px' }}>
                        {budget.category}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                        {budget.transactions} transactions
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    background: `${status.color}20`,
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: status.color,
                    fontWeight: '600'
                  }}>
                    {status.label}
                  </span>
                </div>

                {/* Amount Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>Spent</p>
                    <p style={{ color: isOverBudget ? '#ef4444' : 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                      {formatCurrency(budget.spent)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>Budget</p>
                    <p style={{ color: '#94a3b8', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                      {formatCurrency(budget.budgeted)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(percentage, 100)}%`,
                      height: '100%',
                      background: isOverBudget ? '#ef4444' : percentage >= 80 ? '#f59e0b' : budget.color,
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isOverBudget ? (
                      <>
                        <AlertCircle size={14} color="#ef4444" />
                        <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600' }}>
                          Over by {formatCurrency(Math.abs(remaining))}
                        </span>
                      </>
                    ) : (
                      <>
                        <Target size={14} color="#22c55e" />
                        <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: '600' }}>
                          {formatCurrency(remaining)} left
                        </span>
                      </>
                    )}
                  </div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>
                    {percentage.toFixed(0)}% used
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget Tips Card */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <TrendingUp size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>
                Budget Tip
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                You're doing great! Keep tracking your expenses to stay on budget. Review your spending weekly to catch overspending early.
              </p>
            </div>
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
          { icon: '🏠', label: 'Home', active: false },
          { icon: '💳', label: 'Transactions', active: false },
          { icon: '📊', label: 'Budgets', active: true },
          { icon: '⚙️', label: 'Settings', active: false }
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
            <span style={{ fontSize: '24px' }}>{item.icon}</span>
            <span style={{ fontSize: '11px' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBudget;