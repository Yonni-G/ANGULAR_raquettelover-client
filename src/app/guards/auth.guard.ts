import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const userRoles = this.authService.getRoles();

    const hasRole = expectedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      // Rediriger ou afficher message d’erreur
      this.router.navigate(['/access-denied']);
      return false;
    }
    return true;
  }
}
