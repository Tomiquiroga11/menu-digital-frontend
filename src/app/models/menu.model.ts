export interface ProductoDto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    estaDestacado: boolean;
    tieneDescuento: boolean;
    porcentajeDescuento: number;
    tieneHappyHour: boolean;
    categoriaId: number;
    imagenUrl?: string;
    precioOriginal?: number;
    enHappyHourAhora?: boolean;
  }
  
  export interface CategoriaConProductosDto {
    id: number;
    nombre: string;
    productos: ProductoDto[];
  }
  
  export interface MenuCompletoDto {
    idRestaurante: number;
    nombreRestaurante: string;
    categorias: CategoriaConProductosDto[];
  }

  export interface CategoriaDto {
    id: number;
    nombre: string;
  }