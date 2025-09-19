import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';
import { emailValidator } from '../../../validators/emailValidator';
import { passwordValidator } from '../../../validators/passwordValidator';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly jwtHelper = inject(JwtHelperService);
  loading: boolean = false;

  form = new FormGroup({
    username: new FormControl(null, [Validators.required, emailValidator()]),
    password: new FormControl(null, [
      Validators.required,
      // Au moins 8 caractères, au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial
      passwordValidator(),
    ]),
  });

  onSubmit() {
    if (this.form.valid) {
      // on va interroger notre api via le service authService
      this.loading = true;

      this.authService
        .signIn({
          username: this.form.value.username || '',
          password: this.form.value.password || '',
        })
        .pipe(
          finalize(() => {
            this.loading = false; // ← toujours exécuté
          })
        )
        .subscribe({
          next: (res) => {
            if (res.data?.firstName) {
              this.authService.setFirstName(res.data.firstName);
            }
            // Succès
            this.authService.setJwtToken(res.data.jwtToken || '');
            this.authService.login();

            // rediriger en fonction des rôles
            this.authService.redirectUser(this.authService.getRoles());
          },
          error: (err) => {
            // Erreur
            let errorMessage = 'Connexion impossible avec le serveur';

            if (err.error?.error?.message) {
              // Message précis retourné par le backend
              errorMessage = err.error.error.message;
            }
            this.messageService.setMessage({
              text: errorMessage,
              type: 'error',
            });
            // on regarde si on a reçu un tableau fields avec des erreurs de validation
            if (err.error.error.fields) {
              for (let fieldError of err.error.error.fields) {
                // on cherche le FormControl correspondant
                const control = this.form.get(fieldError.field);
                if (control) {
                  // on ajoute l'erreur au FormControl
                  control.setErrors({ serverError: fieldError.message });
                }
              }
            }
          },
        });
    } else {
      // form invalide
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
}
