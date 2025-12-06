import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RestauranteService } from '../../services/restaurante.service';
import { RestauranteSimple } from '../../models/restaurante.model';
import { FormsModule } from '@angular/forms';
import { RestaurantFilterPipe } from '../../pipes/restaurant.filter.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RestaurantFilterPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit { 

  restaurantes: RestauranteSimple[] = [];
  cargando: boolean = true;
  isLoggedIn: boolean = false;
  searchTerm: string = '';

  constructor(
    private restauranteService: RestauranteService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.restauranteService.getRestaurantes().subscribe((data: RestauranteSimple[]) => {
    this.restaurantes = data;
    this.cargando = false;
    });
  }
}