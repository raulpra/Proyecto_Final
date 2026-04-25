import type { AuthUser, LoginRequest } from '../types/auth';
import { API_BASE_URL } from '../data/constants';

const USER_STORAGE_KEY = 'sti_user';

export function saveUser(user: AuthUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export async function loginRequest(payload: LoginRequest): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Credenciales incorrectas. Verifica usuario y contraseña.');
  }

  return (await response.json()) as AuthUser;
}
