import { Pipe, PipeTransform } from '@angular/core';
import { ProductoDto } from '../models/menu.model';

@Pipe({
  name: 'filter',
  standalone: true // ¡Importante para usarlo sin Módulos!
})
export class FilterPipe implements PipeTransform {

  /**
   * @param items La lista de productos a filtrar
   * @param searchText El texto que escribió el usuario
   */
  transform(items: ProductoDto[], searchText: string): ProductoDto[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(it => {
      return it.nombre.toLowerCase().includes(searchText) || 
             it.descripcion.toLowerCase().includes(searchText);
    });
  }
}