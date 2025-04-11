import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';  

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(private router: Router, private cookieService: CookieService) { }

  logout() {
    // Effacer les cookies ou les tokens de session
    this.cookieService.delete('authToken');  // Exemple de suppression d'un cookie de session
    
    // Rediriger l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }
}
