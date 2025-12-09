import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return; 
    }

    this.errorMessage = ''; 

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMessage = 'Credenciales inválidas. Por favor, intenta de nuevo.';
      }
    });
  }
}