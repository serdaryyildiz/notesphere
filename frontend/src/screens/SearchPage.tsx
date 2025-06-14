import React, { useState } from 'react';
import { COLORS } from '../styles/theme';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'notes' | 'repositories' | 'users'>('notes');

  return (
    <div className="container">
      <header style={{
        backgroundColor: COLORS.primary,
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '8px',
        color: COLORS.white
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Search</h1>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Search notes, repositories, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem' }}
          />
        </div>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: `1px solid ${COLORS.border}`,
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setActiveTab('notes')}
            style={{
              padding: '0.5rem 1rem',
              borderBottom: `2px solid ${activeTab === 'notes' ? COLORS.primary : 'transparent'}`,
              color: activeTab === 'notes' ? COLORS.primary : COLORS.textLight,
              fontWeight: activeTab === 'notes' ? 'bold' : 'normal'
            }}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('repositories')}
            style={{
              padding: '0.5rem 1rem',
              borderBottom: `2px solid ${activeTab === 'repositories' ? COLORS.primary : 'transparent'}`,
              color: activeTab === 'repositories' ? COLORS.primary : COLORS.textLight,
              fontWeight: activeTab === 'repositories' ? 'bold' : 'normal'
            }}
          >
            Repositories
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.5rem 1rem',
              borderBottom: `2px solid ${activeTab === 'users' ? COLORS.primary : 'transparent'}`,
              color: activeTab === 'users' ? COLORS.primary : COLORS.textLight,
              fontWeight: activeTab === 'users' ? 'bold' : 'normal'
            }}
          >
            Users
          </button>
        </div>

        <div className="card">
          {searchQuery ? (
            <p style={{ color: COLORS.textLight }}>No results found for "{searchQuery}"</p>
          ) : (
            <p style={{ color: COLORS.textLight }}>Enter a search query to find content</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 