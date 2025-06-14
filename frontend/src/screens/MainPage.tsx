import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../styles/theme';

const MainPage: React.FC = () => {
  return (
    <div className="container">
      <header style={{
        backgroundColor: COLORS.primary,
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '8px',
        color: COLORS.white
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to NoteSphere</h1>
        <p>Your personal note-taking and knowledge management platform</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <h2 style={{ color: COLORS.primary, marginBottom: '1rem' }}>Quick Notes</h2>
          <p style={{ color: COLORS.textLight, marginBottom: '1rem' }}>
            Create and manage your notes efficiently
          </p>
          <Link to="/notes" className="btn btn-primary">View Notes</Link>
        </div>

        <div className="card">
          <h2 style={{ color: COLORS.primary, marginBottom: '1rem' }}>Repositories</h2>
          <p style={{ color: COLORS.textLight, marginBottom: '1rem' }}>
            Organize your notes into repositories
          </p>
          <Link to="/repositories" className="btn btn-primary">View Repositories</Link>
        </div>

        <div className="card">
          <h2 style={{ color: COLORS.primary, marginBottom: '1rem' }}>Search</h2>
          <p style={{ color: COLORS.textLight, marginBottom: '1rem' }}>
            Find notes and repositories quickly
          </p>
          <Link to="/search" className="btn btn-primary">Search</Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ color: COLORS.primary, marginBottom: '1rem' }}>Recent Activity</h2>
        <div style={{ color: COLORS.textLight }}>
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 