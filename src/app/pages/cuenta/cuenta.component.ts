import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { AuthService } from '../../services/auth.service';
import { ReporteVisitas } from '../../models/restaurante.model';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.scss'
})
export class CuentaComponent implements OnInit {
  
  reporte: ReporteVisitas | null = null;
  cargando: boolean = true;
  userEmail: string = '';
  
  isEditing: boolean = false;
  cuentaForm: FormGroup;

  constructor(
    private reporteService: ReporteService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cuentaForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      imagenUrl: [''],
      password: [''], 
      horaApertura: [9, [Validators.required, Validators.min(0), Validators.max(23)]],
      horaCierre: [23, [Validators.required, Validators.min(0), Validators.max(23)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarReporte();
  }

  cargarDatosUsuario(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payloadPart = token.split('.')[1];
        const payloadDecoded = atob(payloadPart);
        const payloadObj = JSON.parse(payloadDecoded);
        this.userEmail = payloadObj.email || 
                         payloadObj['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 
                         '';
      } catch (e) {
        console.error('Error al leer token', e);
      }
    }
  }

  cargarReporte(): void {
    this.reporteService.getVisitas().subscribe({
      next: (data) => {
        this.reporte = data;
        this.cargando = false;
        this.cuentaForm.patchValue({
          nombre: data.nombreRestaurante,
          email: this.userEmail
        });
      },
      error: (err) => {
        console.error('Error al cargar reporte', err);
        this.cargando = false;
      }
    });
  }


  startEdit(): void {
    this.isEditing = true;
  if (this.reporte) {
      this.cuentaForm.patchValue({
          nombre: this.reporte.nombreRestaurante,
          email: this.userEmail,
          telefono: this.reporte.telefono,
          imagenUrl: this.reporte.imagenUrl 
      });
  }
}

  cancelEdit(): void {
    this.isEditing = false;
    if (this.reporte) {
      this.cuentaForm.patchValue({
        nombre: this.reporte.nombreRestaurante,
        email: this.userEmail,
        password: ''
      });
    }
  }

  onUpdate(): void {
    if (this.cuentaForm.invalid) return;

    const passwordIngresada = this.cuentaForm.value.password;

    if (!passwordIngresada) {
        alert("Por seguridad, debes ingresar tu contraseña actual (o una nueva) para guardar los cambios.");
        return; 
    }

    const datosActualizados = {
      nombre: this.cuentaForm.value.nombre,
      email: this.cuentaForm.value.email,
      telefono: this.cuentaForm.value.telefono,
      imagenUrl: this.cuentaForm.value.imagenUrl,
      password: passwordIngresada, 
      confirmarPassword: passwordIngresada,
      horaApertura: this.cuentaForm.value.horaApertura,
      horaCierre: this.cuentaForm.value.horaCierre 
    };

    this.reporteService.updateCuenta(datosActualizados).subscribe({
      next: () => {
        alert('Datos actualizados. Inicia sesión de nuevo.');
        this.authService.logout();
      },
      error: (err) => {
        console.error(err); 
        alert('Error al actualizar cuenta.');
      }
    });
}

  onDeleteAccount(): void {
    if (confirm('⚠️ ¿ESTÁS SEGURO? Esta acción eliminará tu restaurante y todos tus datos permanentemente. No se puede deshacer.')) {
      this.reporteService.deleteCuenta().subscribe({
        next: () => {
          alert('Tu cuenta ha sido eliminada.');
          this.authService.logout();
        },
        error: (err) => {
          alert('No se pudo eliminar la cuenta.');
          console.error(err);
        }
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}