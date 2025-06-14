import React, { useState } from 'react';
import { COLORS } from '../styles/theme';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface Note {
  id: number;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

const SAMPLE_NOTES: Note[] = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      title: "Mathematics Student",
      avatar: "/src/assets/profil-logo.jpg"
    },
    content: "Just solved a complex integral problem using the substitution method! Here's my step-by-step solution for ∫(x²+1)/(x⁴+2x²+1)dx. The key was recognizing that the denominator is (x²+1)². #Calculus #Mathematics #IntegralCalculus",
    timestamp: "2h ago",
    likes: 42,
    comments: 15
  },
  {
    id: 2,
    author: {
      name: "Michael Chen",
      title: "Chemistry Student",
      avatar: "/src/assets/profil-logo.jpg"
    },
    content: "Created a comprehensive study guide on Nucleophilic Substitution Reactions (SN1 & SN2). Understanding the mechanism of these reactions is crucial for Organic Chemistry. Check out my notes on leaving groups and nucleophiles! #OrganicChemistry #Chemistry #StudyNotes",
    timestamp: "5h ago",
    likes: 128,
    comments: 32
  }
];

const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: COLORS.background
    }}>
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '16rem' : '0',
        transition: 'margin-left 0.3s ease',
        padding: '5rem 1rem 2rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '60rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Create Note Section */}
          <div style={{
            marginTop: '2rem',
            backgroundColor: COLORS.surface,
            borderRadius: '0.5rem',
            padding: '1rem',
            border: `1px solid ${COLORS.border}`
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <img
                src="/src/assets/profil-logo.jpg"
                alt="Your avatar"
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  border: `2px solid ${COLORS.border}`
                }}
              />
              <button
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '2rem',
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.surface,
                  color: COLORS.textLight,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                Start a note...
              </button>
            </div>
          </div>

          {/* Notes Feed */}
          {SAMPLE_NOTES.map(note => (
            <div
              key={note.id}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: '0.5rem',
                padding: '1rem',
                border: `1px solid ${COLORS.border}`
              }}
            >
              {/* Note Header */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <img
                  src={note.author.avatar}
                  alt={note.author.name}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    border: `2px solid ${COLORS.border}`
                  }}
                />
                <div>
                  <h3 style={{
                    margin: 0,
                    color: COLORS.text,
                    fontSize: '1rem',
                    fontWeight: 500
                  }}>
                    {note.author.name}
                  </h3>
                  <p style={{
                    margin: '0.25rem 0 0',
                    color: COLORS.textLight,
                    fontSize: '0.875rem'
                  }}>
                    {note.author.title} • {note.timestamp}
                  </p>
                </div>
              </div>

              {/* Note Content */}
              <p style={{
                margin: '0 0 1rem',
                color: COLORS.text,
                fontSize: '1rem',
                lineHeight: 1.5
              }}>
                {note.content}
              </p>

              {/* Note Actions */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                color: COLORS.textLight,
                fontSize: '0.875rem'
              }}>
                <button
                  className="btn"
                  style={{
                    color: COLORS.textLight,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {note.likes} Likes
                </button>
                <button
                  className="btn"
                  style={{
                    color: COLORS.textLight,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {note.comments} Comments
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage; 