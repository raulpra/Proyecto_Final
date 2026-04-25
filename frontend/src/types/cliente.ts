export interface Cliente {
  id: number;
  dni: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaAlta?: string;
}

export interface ClienteInDto {
  dni: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}
