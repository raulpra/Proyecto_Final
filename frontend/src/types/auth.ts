
export type AppRole = 'ADMIN' | 'TECNICO';

export interface AuthUser {
  id?: number;
  username: string;
  nombre?: string;
  rol?: AppRole | string;
  activo?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}
