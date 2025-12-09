import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main.layout.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ManageCategoriasComponent } from './pages/manage-categorias/manage.categorias.component';
import { ManageProductosComponent } from './pages/manage-productos/manage.productos.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { authGuard } from './guards/auth.guard';
import { ProductoNuevoComponent } from './pages/producto-nuevo/producto.nuevo.component';
import { CategoriaNuevaComponent } from './pages/categoria.nueva/categoria.nueva.component';

export const routes: Routes = [
  
  {
    path: '', 
    component: MainLayoutComponent, 
    children: [
      
      { path: '', component: HomeComponent }, 
      
      { path: 'menu/:id', component: MenuComponent },
      
      { 
        path: 'admin/manage-categorias', 
        component: ManageCategoriasComponent,
        canActivate: [authGuard] 
      },
      { 
        path: 'admin/categorias/nueva', 
        component: CategoriaNuevaComponent 
      },
      { 
        path: 'admin/categorias/editar/:id', 
        component: CategoriaNuevaComponent 
      },
      { 
        path: 'admin/manage-productos', 
        component: ManageProductosComponent,
        canActivate: [authGuard] 
      },
      { 
        path: 'admin/productos/nuevo', 
        component: ProductoNuevoComponent 
      },
  
      { 
        path: 'admin/productos/editar/:id', 
        component: ProductoNuevoComponent 
      },
      { 
        path: 'admin/cuenta', 
        component: CuentaComponent,
        canActivate: [authGuard] 
      },
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];