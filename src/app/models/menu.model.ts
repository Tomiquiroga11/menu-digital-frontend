export interface ProductoDto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal?: number | null; 
  imagenUrl?: string;
  estaDestacado: boolean;
  
  tieneDescuento: boolean;
  porcentajeDescuento: number;
  tieneHappyHour: boolean;
  enHappyHourAhora?: boolean; 

  categoriaId: number;
}

export interface CategoriaDto {
  id: number;
  nombre: string;
}

export interface CategoriaConProductosDto extends CategoriaDto {
  productos: ProductoDto[];
}

export interface MenuCompletoDto {
  idRestaurante: number;
  nombreRestaurante: string;
  categorias: CategoriaConProductosDto[];
}


export interface ProductoCreateDto {
  nombre: string;
  descripcion: string;
  precio: number;
  estaDestacado: boolean;
  categoriaId: number;
  imagenUrl: string;
  tieneDescuento: boolean;
  porcentajeDescuento: number;
  tieneHappyHour: boolean;
}

export interface ProductoUpdateDto {
  nombre: string;
  descripcion: string;
  precio: number;
  estaDestacado: boolean;
  categoriaId: number;
  imagenUrl: string;
  tieneDescuento: boolean;
  porcentajeDescuento: number;
  tieneHappyHour: boolean;
}


export interface ProductoDescuentoDto {
  tieneDescuento: boolean;
  porcentajeDescuento: number;
}

export interface ProductoHappyHourDto {
  tieneHappyHour: boolean;
}