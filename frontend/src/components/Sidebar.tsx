import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../styles/theme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  items: {
    name: string;
    path: string;
  }[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Repositories",
    items: [
      { name: "My Repositories", path: "/repositories/my" },
      { name: "Search Repositories", path: "/repositories/search" },
      { name: "Popular Repositories", path: "/repositories/popular" },
      { name: "Create Repository", path: "/repositories/create" }
    ]
  },
  {
    title: "Notes",
    items: [
      { name: "My Notes", path: "/notes/my" },
      { name: "Search Notes", path: "/notes/search" },
      { name: "Popular Notes", path: "/notes/popular" },
      { name: "Add Note", path: "/notes/create" }
    ]
  },
  {
    title: "Social",
    items: [
      { name: "Search People", path: "/social/search" },
      { name: "My Followers", path: "/social/followers" }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '4rem',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 998
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: '4rem',
          left: 0,
          bottom: 0,
          width: '16rem',
          backgroundColor: COLORS.surface,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 999,
          overflowY: 'auto',
          background: `linear-gradient(135deg, ${COLORS.surface} 0%, rgba(73, 10, 18, 0.05) 100%)`,
          boxShadow: isOpen ? '0 0 1rem rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        {/* Menu Items */}
        <div style={{ padding: '1rem' }}>
          {MENU_ITEMS.map((section, index) => (
            <div
              key={section.title}
              style={{
                marginBottom: '2rem',
                borderBottom: index !== MENU_ITEMS.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                paddingBottom: index !== MENU_ITEMS.length - 1 ? '1rem' : 0
              }}
            >
              <h3 style={{
                color: COLORS.primary,
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '1rem',
                letterSpacing: '0.05em'
              }}>
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.items.map(item => (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className="sidebar-menu-item"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 