import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { RestauranteService } from '../../services/restaurante.service';
import { AuthService } from '../../services/auth.service';
import { ReporteVisitas } from '../../models/restaurante.model';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.scss',
})
export class CuentaComponent implements OnInit {
  reporte: ReporteVisitas | undefined;
  cargando: boolean = true;
  isEditing: boolean = false;
  cuentaForm: FormGroup;
  userEmail: string = '';

  constructor(
    private reporteService: ReporteService,
    private restauranteService: RestauranteService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cuentaForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      imagenUrl: [''],
      horaApertura: [9, [Validators.required, Validators.min(0), Validators.max(23)]],
      horaCierre: [23, [Validators.required, Validators.min(0), Validators.max(23)]],
      happyHourInicio: [17, [Validators.required, Validators.min(0), Validators.max(23)]],
      happyHourFin: [21, [Validators.required, Validators.min(0), Validators.max(23)]],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail() || '';
    this.cargarDatos();
  }

  cargarDatos() {
    this.reporteService.getReporte().subscribe({
      next: (data) => {
        this.reporte = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      },
    });
  }

  startEdit() {
    if (this.reporte) {
      this.isEditing = true;
      this.cuentaForm.patchValue({
        nombre: this.reporte.nombreRestaurante,
        email: this.userEmail,
        telefono: this.reporte.telefono,
        imagenUrl: this.reporte.imagenUrl,
        horaApertura: this.reporte.horaApertura,
        horaCierre: this.reporte.horaCierre,
        happyHourInicio: this.reporte.happyHourInicio,
        happyHourFin: this.reporte.happyHourFin,
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.cuentaForm.reset();
  }

  onUpdate() {
    if (this.cuentaForm.invalid) return;

    const formValues = this.cuentaForm.value;

    const updateData = {
      nombre: formValues.nombre,
      email: formValues.email,
      telefono: formValues.telefono,
      imagenUrl: formValues.imagenUrl,
      horaApertura: Number(formValues.horaApertura),
      horaCierre: Number(formValues.horaCierre),
      happyHourInicio: Number(formValues.happyHourInicio || this.reporte?.happyHourInicio || 0),
      happyHourFin: Number(formValues.happyHourFin || this.reporte?.happyHourFin || 0),
      password: formValues.password || null,
    };

    this.restauranteService.updateRestaurante(this.reporte!.restauranteId, updateData).subscribe({
      next: () => {
        alert('¡Datos actualizados correctamente!');
        this.isEditing = false;
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert(
          'Error al actualizar datos. Verifica que el email no esté repetido y/o que la contraseña sea correcta.'
        );
      },
    });
  }

  onDeleteAccount() {
    if (confirm('¿ESTÁS SEGURO? Esta acción borrará tu restaurante y menú para siempre.')) {
      if (this.reporte) {
        this.restauranteService.deleteRestaurante(this.reporte.restauranteId).subscribe({
          next: () => {
            alert('Cuenta eliminada.');
            this.authService.logout();
            this.router.navigate(['/']);
          },
          error: (err) => alert('Error al eliminar cuenta.'),
        });
      }
    }
  }
}
