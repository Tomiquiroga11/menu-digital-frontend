import { Routes } from '@angular/router';

// 1. Importa tu Layout
import { MainLayoutComponent } from './layouts/main-layout/main.layout.component';

// 2. Importa tus páginas (Componentes)
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ManageCategoriasComponent } from './pages/manage-categorias/manage.categorias.component';
import { ManageProductosComponent } from './pages/manage-productos/manage.productos.component';
import { CuentaComponent } from './pages/cuenta/cuenta.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  
  // --- RUTA PADRE (LAYOUT) ---
  {
    path: '', 
    component: MainLayoutComponent, // Este componente tiene el <router-outlet> principal y el Navbar
    children: [
      // Todas estas rutas se renderizarán DENTRO del MainLayoutComponent
      
      { path: '', component: HomeComponent }, // Ruta raíz (Home)
      
      { path: 'menu/:id', component: MenuComponent },
      
      // Rutas protegidas de Admin
      { 
        path: 'admin/manage-categorias', 
        component: ManageCategoriasComponent,
        canActivate: [authGuard] 
      },
      { 
        path: 'admin/manage-productos', 
        component: ManageProductosComponent,
        canActivate: [authGuard] 
      },
      { 
        path: 'admin/cuenta', 
        component: CuentaComponent,
        canActivate: [authGuard] 
      },
    ]
  },

  // --- RUTAS FUERA DEL LAYOUT (Sin Navbar) ---
  // Estas páginas ocuparán toda la pantalla, sin el menú de navegación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- COMODÍN (Siempre al final) ---
  { path: '**', redirectTo: '', pathMatch: 'full' }
];