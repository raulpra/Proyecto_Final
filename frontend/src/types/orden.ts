export type EstadoOrden = 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADO';

export interface OrdenReparacion {
  id: number;
  descripcionAveria: string;
  estado: EstadoOrden;
  fechaEntrada?: string;
  fechaSalida?: string;
  kilometros?: number;
  precioEstimado?: number;
  precioFinal?: number;
  matriculaVehiculo: string;
  marcaVehiculo?: string;
  modeloVehiculo?: string;
}

export interface OrdenReparacionInDto {
  descripcionAveria: string;
  estado: EstadoOrden;
  fechaEntrada?: string;
  fechaSalida?: string;
  kilometros?: number;
  precioEstimado?: number;
  precioFinal?: number;
  matriculaVehiculo: string;
}
