import React, { useState } from 'react';
import { COLORS } from '../styles/theme';

interface Repository {
  id: string;
  name: string;
  description: string;
  noteCount: number;
  lastUpdated: string;
}

const RepositoriesPage: React.FC = () => {
  const [repositories] = useState<Repository[]>([
    {
      id: '1',
      name: 'Personal Notes',
      description: 'My personal notes and thoughts',
      noteCount: 12,
      lastUpdated: '2024-03-15'
    },
    {
      id: '2',
      name: 'Work Projects',
      description: 'Notes related to work projects',
      noteCount: 8,
      lastUpdated: '2024-03-14'
    },
    {
      id: '3',
      name: 'Study Materials',
      description: 'Notes for my studies',
      noteCount: 15,
      lastUpdated: '2024-03-13'
    }
  ]);

  return (
    <div className="container">
      <header style={{
        backgroundColor: COLORS.primary,
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '8px',
        color: COLORS.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2rem' }}>Repositories</h1>
        <button className="btn btn-secondary" style={{ backgroundColor: COLORS.white, color: COLORS.primary }}>
          Create Repository
        </button>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {repositories.map(repo => (
          <div key={repo.id} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ color: COLORS.primary, marginBottom: '0.5rem' }}>{repo.name}</h2>
                <p style={{ color: COLORS.textLight, marginBottom: '1rem' }}>{repo.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                  Edit
                </button>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: COLORS.error }}>
                  Delete
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: COLORS.textLight, fontSize: '0.875rem' }}>
              <span>{repo.noteCount} notes</span>
              <span>Last updated: {repo.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoriesPage; 