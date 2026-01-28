import React, { useState } from 'react';
import { ChevronRight, User, Lock, Bell, Palette, Globe, Database, HelpCircle, LogOut, Moon, Sun } from 'lucide-react';

const MobileSettings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: <User size={20} />, label: 'Profile', value: 'John Doe', color: '#3b82f6' },
        { icon: <Lock size={20} />, label: 'Security & Password', value: '', color: '#ef4444' },
        { icon: <Globe size={20} />, label: 'Currency & Region', value: 'USD', color: '#22c55e' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={20} />, label: 'Notifications', value: notifications, color: '#f59e0b', toggle: true },
        { icon: <Palette size={20} />, label: 'Theme', value: darkMode ? 'Dark' : 'Light', color: '#8b5cf6' },
        { icon: <Moon size={20} />, label: 'Dark Mode', value: darkMode, color: '#64748b', toggle: true }
      ]
    },
    {
      title: 'Data & Privacy',
      items: [
        { icon: <Database size={20} />, label: 'Export Data', value: '', color: '#14b8a6' },
        { icon: <Database size={20} />, label: 'Data Management', value: '', color: '#ec4899' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle size={20} />, label: 'Help Center', value: '', color: '#3b82f6' },
        { icon: <HelpCircle size={20} />, label: 'Contact Support', value: '', color: '#22c55e' }
      ]
    }
  ];

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
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: 'white',
          marginBottom: '8px',
          background: 'linear-gradient(to right, #86efac, #fbbf24)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div style={{ padding: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.2), rgba(17, 24, 39, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(21, 128, 61, 0.3)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #22c55e, #15803d)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
              color: 'white'
            }}>
              JD
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>
                John Doe
              </h2>
              <p style={{ color: '#86efac', fontSize: '14px', margin: 0 }}>
                john.doe@example.com
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              flex: 1, 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Accounts</p>
              <p style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>5</p>
            </div>
            <div style={{ 
              flex: 1, 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Budgets</p>
              <p style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>6</p>
            </div>
            <div style={{ 
              flex: 1, 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>Groups</p>
              <p style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>3</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIdx) => (
          <div key={sectionIdx} style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: '#64748b', 
              fontSize: '13px', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              marginBottom: '12px',
              paddingLeft: '4px'
            }}>
              {section.title}
            </h3>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx}>
                  <button
                    onClick={() => {
                      if (item.toggle && item.label === 'Notifications') {
                        setNotifications(!notifications);
                      } else if (item.toggle && item.label === 'Dark Mode') {
                        setDarkMode(!darkMode);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: itemIdx < section.items.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: `${item.color}20`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color
                      }}>
                        {item.icon}
                      </div>
                      <span style={{ color: 'white', fontSize: '15px', fontWeight: '500' }}>
                        {item.label}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.toggle ? (
                        <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '28px' }}>
                          <input
                            type="checkbox"
                            checked={item.value}
                            onChange={() => {}}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: item.value ? '#15803d' : 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '28px',
                            transition: '0.3s'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: '22px',
                              width: '22px',
                              left: item.value ? '24px' : '3px',
                              bottom: '3px',
                              background: 'white',
                              borderRadius: '50%',
                              transition: '0.3s'
                            }}></span>
                          </span>
                        </label>
                      ) : (
                        <>
                          {item.value && typeof item.value === 'string' && (
                            <span style={{ color: '#64748b', fontSize: '14px' }}>{item.value}</span>
                          )}
                          <ChevronRight size={20} color="#64748b" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            Dollar Dollar Bill Y'all
          </h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Version 1.0.0</p>
          <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>
            Part of the palStack ecosystem
          </p>
        </div>

        {/* Logout Button */}
        <button style={{
          width: '100%',
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          color: '#ef4444',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '100px'
        }}>
          <LogOut size={20} /> Sign Out
        </button>
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
          { icon: '📊', label: 'Budgets', active: false },
          { icon: '⚙️', label: 'Settings', active: true }
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

export default MobileSettings;