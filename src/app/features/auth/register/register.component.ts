import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { RegisterRequest } from '../../../api/auth.api';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: '../login/login.component.css' // Reuse login styles
})
export class RegisterComponent {
    registerForm;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            firstName: [''],
            lastName: [''],
            role: ['USER', Validators.required]
        });
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            return;
        }

        this.isLoading = true;
        const formVal = this.registerForm.getRawValue();

        const payload: RegisterRequest = {
            username: formVal.username!,
            password: formVal.password!,
            email: formVal.email!,
            firstName: formVal.firstName || '',
            lastName: formVal.lastName || '',
            role: formVal.role as 'USER' | 'ADMIN' | 'MANAGER'
        };

        this.authService.register(payload).subscribe({
            next: () => {
                this.toastService.success('Registration successful! Please login.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.toastService.error(err.error.message || 'Registration failed');
                this.isLoading = false;
            }
        });
    }
}
