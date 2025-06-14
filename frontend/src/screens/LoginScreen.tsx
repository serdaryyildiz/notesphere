import React, { useState } from 'react';
import { COLORS, FONTS } from '../styles/theme';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Giriş başarısız.');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      alert('Giriş başarılı!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Logo */}
      <div style={styles.logo}>
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

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.button}>Giriş Yap</button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: COLORS.background,
    minHeight: '100vh',
    padding: '5vh 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    fontFamily: FONTS.script.fontFamily,
    color: COLORS.primary,
    fontSize: 'clamp(3rem, 10vw, 7rem)', // responsive logo boyutu
    marginBottom: '2rem',
  },
  form: {
    width: '100%',
    maxWidth: '25rem', // 400px
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.875rem 1rem', // ~14px 16px
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: `1px solid ${COLORS.border}`,
    outline: 'none',
  },
  button: {
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  error: {
    color: COLORS.error,
    fontSize: '0.875rem',
  },
};

export default LoginScreen;
