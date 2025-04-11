import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérification de l'authentification
  if (authService.isAuthenticated()) {
    const requiredRole = route.data['role'] as string;

    // Vérification du rôle si spécifié dans les données de la route
    if (!requiredRole || authService.getRole() === requiredRole) {
      return true;
    } else {
      // Redirection si l'utilisateur n'a pas le rôle requis
      router.navigate(['/unauthorized']);
      return false;
    }
  } else {
    // Redirection vers la page de connexion avec retour à l'URL demandée
    router.navigate([''], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
