import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loginMessage: string = '';

  constructor(private authService: AuthService, 
              private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.loginMessage = 'Login successful';
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Login error', error);
        this.loginMessage = 'Login failed';
      }
    );
  }
}
