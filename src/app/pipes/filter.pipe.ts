import { Pipe, PipeTransform } from '@angular/core';
import { ProductoDto } from '../models/menu.model';

@Pipe({
  name: 'filter',
  standalone: true 
})
export class FilterPipe implements PipeTransform {

  /**
   * @param items 
   * @param searchText 
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