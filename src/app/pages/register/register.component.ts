import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
      imagenUrl: ['']
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmarPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    console.log('Botón presionado. Estado del form:', this.registerForm.status);
  console.log('Errores:', this.registerForm.errors); 
  
  if (this.registerForm.invalid) {
    console.log('El formulario es inválido, no se envía nada.');
    return;
  }

    if (this.registerForm.invalid) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        if (err.status === 400 && err.error.message) {
            this.errorMessage = err.error.message;
        } else {
            this.errorMessage = 'Ocurrió un error al registrarse. Intenta nuevamente.';
        }
      }
    });
  }
}