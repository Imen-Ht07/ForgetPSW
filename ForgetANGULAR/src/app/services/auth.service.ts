import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Méthode pour inscrire un nouvel utilisateur
  register(userData: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  // Méthode pour connecter un utilisateur
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Stocke le token et le rôle dans les cookies après la connexion
        if (response.token) {
          this.cookieService.set('authToken', response.token);
        }
        if (response.role) {
          this.cookieService.set('userRole', response.role);
        }
      })
    );
  }

  // Méthode pour obtenir tous les utilisateurs
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllUsers`);
  }

  // Méthode pour mettre à jour un utilisateur
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateUser/${id}`, userData);
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteUser/${id}`);
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.cookieService.check('authToken');
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userRole');
  }

  // Méthode pour obtenir le token
  getToken(): string | null {
    return this.cookieService.get('authToken');
  }

  // Méthode pour obtenir le rôle de l'utilisateur
  getRole(): string | null {
    return this.cookieService.get('userRole');
  }
// Demander un email de réinitialisation de mot de passe
// Réinitialiser le mot de passe avec un token et un nouveau mot de passe
forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/forgot-password`, { email });
}
resetPassword(userId: string, token: string, data: { password: string }): Observable<any> {
  return this.http.post(`${this.baseUrl}/reset-password/${userId}/${token}`, data);
}
}
