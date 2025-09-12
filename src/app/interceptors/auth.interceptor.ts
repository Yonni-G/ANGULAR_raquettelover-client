import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwtToken = this.authService.getJwtToken();

    if (jwtToken) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return next.handle(cloned).pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.authService.signOut(); // Nettoyer le storage, etc.
            this.messageService.setMessage({
              text: 'Votre session a expiré. Veuillez vous reconnecter.',
              type: 'info',
            });
            this.router.navigate(['/signin']); // Redirection
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }
}
