import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // If already authenticated, redirect to dashboard
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(username, password).subscribe({
        next: (success) => {
          if (success) {
            // Login successful
            this.redirectToDashboard();
          } else {
            // Login failed
            this.errorMessage = 'Invalid username or password';
            this.isLoading = false;
          }
        },
        error: (error) => {
          // Handle login error
          this.errorMessage = error?.error?.error || 'Invalid username or password';
          this.isLoading = false;
        }
      });
    } else {
      // Form is invalid
      this.errorMessage = 'Please enter both username and password';
    }
  }

  private redirectToDashboard(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dash';
    this.router.navigate([returnUrl]);
  }
}
