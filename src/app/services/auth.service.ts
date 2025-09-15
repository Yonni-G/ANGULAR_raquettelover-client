import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../models/ApiResponse';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiAuthService } from './api-auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly JWT_TOKEN_KEY = 'jwtToken';
  private readonly apiAuthService: ApiAuthService = inject(ApiAuthService);
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private roles: string[] = [];
  private firstName: string = '';
  private userId!: number;

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    this.login();
  }

  public login() {
    const token = this.getJwtToken();
    if (token) {
      const decodedToken: any = this.jwtHelper.decodeToken(token);
      const roles: string[] = decodedToken.roles || [];
      this.setRoles(roles);
      const userId: number = decodedToken.userId || null;
      this.setUserId(userId);
    }
    // on informe les abonnés que l'utilisateur est connecté
    this.setLoggedIn(true);
  }

  public setLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

  public signIn(credentials: {
    username: string;
    password: string;
  }): Observable<ApiResponse<any>> {
    return this.apiAuthService.signIn(credentials);
  }

  public signOut(): void {
    localStorage.removeItem(this.JWT_TOKEN_KEY);
    localStorage.removeItem('firstName');
    this.roles = [];
    this.firstName = '';

    // on informe les abonnés que l'utilisateur est déconnecté
    this.setLoggedIn(false);

    // Rediriger vers la page de connexion
    this.router.navigate(['/signin']);
  }

  public signUp(user: {
    username: string;
    password: string;
    confirmPassword: string;
  }): Observable<ApiResponse<any>> {
    return this.apiAuthService.signUp(user);
  }

  public getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN_KEY);
  }

  public setJwtToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN_KEY, token);
  }

  public redirectUser(roles: string[]) {
    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/dashboard/place/list']);
    } else if (roles.includes('ROLE_MANAGER')) {
      this.router.navigate(['/dashboard/place/list']);
    } else if (roles.includes('ROLE_USER')) {
      this.router.navigate(['/dashboard/player']);
    } else {
      this.router.navigate(['/']); // route par défaut
    }
  }

  setRoles(roles: string[]) {
    this.roles = roles;
  }

  getRoles(): string[] {
    return this.roles;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
  getUserId(): number {
    return this.userId;
  }

  setFirstName(firstName: string) {
    this.firstName = firstName;
    localStorage.setItem('firstName', firstName);
  }

  getFirstName(): string {
    // si on a la valeur dans le localstorage
    const storedFirstName = localStorage.getItem('firstName');
    if (storedFirstName) {
      this.firstName = storedFirstName;
    }
    return this.firstName;
  }
}
