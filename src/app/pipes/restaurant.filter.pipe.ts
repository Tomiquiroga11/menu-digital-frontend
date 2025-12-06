import { Pipe, PipeTransform } from '@angular/core';
import { RestauranteSimple } from '../models/restaurante.model';

@Pipe({
  name: 'restaurantFilter',
  standalone: true
})
export class RestaurantFilterPipe implements PipeTransform {

  transform(items: RestauranteSimple[], searchText: string): RestauranteSimple[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(rest => {
      return rest.nombre.toLowerCase().includes(searchText);
    });
  }
}