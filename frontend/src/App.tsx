
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import NavBar from './components/NavBar';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ClientesPage from './pages/ClientesPage';
import VehiculosPage from './pages/VehiculosPage';
import OrdenesPage from './pages/OrdenesPage';
import UsuariosPage from './pages/UsuariosPage';

import RequireAuth from './auth/RequireAuth';
import RequireRole from './auth/RequireRole';
import { clearUser, getUser, loginRequest, saveUser } from './auth/authApi';

import type { AuthUser, LoginRequest } from './types/auth';
import './App.css';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(getUser());

  useEffect(() => {
    const stored = getUser();
    if (stored) {
      setUser(stored);
    }
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  const login = useCallback(async (payload: LoginRequest): Promise<AuthUser> => {
    const authUser = await loginRequest(payload);
    saveUser(authUser);
    setUser(authUser);
    return authUser;
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <NavBar user={user} onLogout={logout} />

      <div className="app-content">
        <Routes>

          <Route path="/login" element={<LoginPage onLogin={login} />} />


          <Route
            path="/"
            element={
              <RequireAuth user={user}>
                <HomePage user={user} />
              </RequireAuth>
            }
          />
          <Route
            path="/usuarios"
            element={
              <RequireAuth user={user}>
                <RequireRole user={user} allowedRoles={['ADMIN']}>
                  <UsuariosPage />
                </RequireRole>
              </RequireAuth>
            }
          />
          <Route
            path="/clientes"
            element={
              <RequireAuth user={user}>
                <ClientesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/vehiculos"
            element={
              <RequireAuth user={user}>
                <VehiculosPage />
              </RequireAuth>
            }
          />
          <Route
            path="/ordenes"
            element={
              <RequireAuth user={user}>
                <OrdenesPage />
              </RequireAuth>
            }
          />

          <Route
            path="*"
            element={
              <div className="container text-center py-5">
                <h2>404 — Página no encontrada</h2>
                <p className="text-muted">La ruta solicitada no existe.</p>
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}
