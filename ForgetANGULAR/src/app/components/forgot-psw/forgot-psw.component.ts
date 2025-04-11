import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-forgot-psw',
  templateUrl: './forgot-psw.component.html',
  styleUrls: ['./forgot-psw.component.css']
})
export class ForgotPswComponent {
  email: string = '';
  message: string = '';

  constructor(private AuthService: AuthService) {}

  onSubmit() {
    this.AuthService.forgotPassword(this.email).subscribe(
      (response) => {
        this.message = 'Un email de réinitialisation a été envoyé.';
      },
      (error) => {
        this.message = error.error.msg || 'Une erreur s\'est produite.';
      }
    );
  }

}
