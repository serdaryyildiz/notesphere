import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, FONTS } from '../styles/theme';
import Toast from '../components/Toast';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending data:', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      const response = await fetch('http://notesphere-backend-env.eba-imphxipc.eu-north-1.elasticbeanstalk.com/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToast({
        message: 'Registration successful! Welcome to NoteSphere.',
        type: 'success'
      });

      // Wait for 1 second before redirecting to allow the toast to be seen
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="card" style={{ 
        width: '100%',
        maxWidth: '24rem',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <span style={{
            fontFamily: FONTS.script.fontFamily,
            fontSize: '8rem',
            color: COLORS.primary,
            lineHeight: 1,
            display: 'block'
          }}>
            n
          </span>
        </div>

        <h1 style={{ 
          color: COLORS.primary,
          fontSize: '2rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Create Account
        </h1>

        {error && (
          <div style={{
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            color: COLORS.error,
            padding: '0.75rem',
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: COLORS.text }}>First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: COLORS.text }}>Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: COLORS.text }}>Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: COLORS.text }}>Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: COLORS.text }}>Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: COLORS.text }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                backgroundColor: COLORS.surface,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              marginTop: '1rem',
              backgroundColor: COLORS.primary,
              color: COLORS.white
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ 
          marginTop: '1rem',
          textAlign: 'center',
          color: COLORS.textLight
        }}>
          <p>Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.primary,
                cursor: 'pointer',
                padding: 0,
                font: 'inherit'
              }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 