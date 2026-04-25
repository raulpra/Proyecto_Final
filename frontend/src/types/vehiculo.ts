export interface Vehiculo {
  matricula: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  clienteId: number;
  clienteNombre?: string;
  clienteApellidos?: string;
}

export interface VehiculoInDto {
  matricula: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  clienteId: number;
}
