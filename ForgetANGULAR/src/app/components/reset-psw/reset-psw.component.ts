import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-reset-psw',
  templateUrl: './reset-psw.component.html',
  styleUrls: ['./reset-psw.component.css']
})
export class ResetPswComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  userId!: string;
  token!: string;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  user: User | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Form control shortcut
  get f() {
    return this.resetPasswordForm.controls;
  }

  // Password match validator
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const { password, confirmPassword } = group.controls;
    if (password.value !== confirmPassword.value) {
      return { 'mismatch': true };
    }
    return null;
  }

  // Submit the form
  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;
  
    this.loading = true;
    const { password } = this.resetPasswordForm.value;
  
    this.authService.resetPassword(this.userId, this.token, { password }).subscribe(
      response => {
        console.log('Response from server:', response);
        this.successMessage = 'Mot de passe réinitialisé avec succès';
        this.router.navigate(['/login']);
      },
      error => {
        // Affichage du message d'erreur détaillé si le serveur envoie un message d'erreur
        if (error.error && error.error.msg) {
          this.errorMessage = error.error.msg;  // Message d'erreur renvoyé par le serveur
        } else {
          this.router.navigate(['/login']);
        }
        console.error('Erreur:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }
  
}
