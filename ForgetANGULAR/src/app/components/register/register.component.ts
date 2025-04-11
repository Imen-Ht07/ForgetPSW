import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData: User = new User();
  registrationMessage: string = '';

  constructor(private authService: AuthService,
              private router: Router
  ) {}

  register() {
    this.authService.register(this.userData).subscribe(
      response => {
        this.registrationMessage = 'User registered successfully';
        this.userData = new User(); 
        this.router.navigate(['/']);
      },
      error => {
        console.error('Registration error', error);
        this.registrationMessage = 'Registration failed';
      }
    );
  }
}
