export type AppRole = 'ADMIN' | 'TECNICO';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: AppRole;
  activo: boolean;
}

export interface UsuarioInDto {
  username: string;
  password?: string;
  nombre: string;
  rol: AppRole;
  activo: boolean;
}
