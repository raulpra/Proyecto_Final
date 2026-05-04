import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser, LoginRequest } from '../types/auth';
import './LoginPage.css';

export default function LoginPage({
  onLogin,
}: {
  onLogin: (payload: LoginRequest) => Promise<AuthUser>;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin({ username, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h2>Acceso al sistema</h2>
          <p>STI — Sistema de Talleres Integrado</p>
        </div>

        <div className="login-card-body">
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="sti-label" htmlFor="login-username">Usuario</label>
              <input
                id="login-username"
                type="text"
                className="sti-input"
                placeholder="nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="login-field">
              <label className="sti-label" htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                className="sti-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-login-submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
