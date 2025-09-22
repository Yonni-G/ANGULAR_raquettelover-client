import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';
import { PlaceService } from '../../../services/place.service';
import { emailValidator } from '../../../validators/emailValidator';
import { nameValidator } from '../../../validators/nameValidator';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { passwordValidator } from '../../../validators/passwordValidator';
import { codeLieuValidator } from '../../../validators/codeLieuValidator';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly placeService: PlaceService = inject(PlaceService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly allowedRoles = ['player', 'manager']; // Paramètres attendus

  signUpAsManager = false;
  placeId: Number | null = null;
  loading = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const signUpAs = paramMap.get('signUpAs');
      // Traitement avec signInAs
      if (!this.allowedRoles.includes(signUpAs!)) {
        // Redirection ou affichage d’une erreur
        this.router.navigate(['/404']);
      }
      this.signUpAsManager = signUpAs === 'manager';

      this.updateCodeLieuValidators();
    });
  }

  // ici les formControl communs
  form = new FormGroup(
    {
      codeLieu: new FormControl(null),
      firstName: new FormControl(null, [Validators.required, nameValidator()]),
      lastName: new FormControl(null, [Validators.required, nameValidator()]),
      username: new FormControl('', [Validators.required, emailValidator()]),
      password: new FormControl('', [Validators.required, passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  );

  private updateCodeLieuValidators(): void {
    const codeLieuControl = this.form.get('codeLieu');

    if (this.signUpAsManager) {
      codeLieuControl?.clearValidators();
    } else {
      codeLieuControl?.setValidators([
        Validators.required,
        codeLieuValidator(),
      ]);
    }
    codeLieuControl?.updateValueAndValidity();
  }

  findByCodeLieu() {
    const codeLieu = this.form.value.codeLieu;
    this.placeService.findByCodeLieu(codeLieu!).subscribe({
      next: (placeId) => (this.placeId = placeId),
      error: (err) => {
        const control = this.form.get('codeLieu');
        control?.setErrors({
          serverError: err.error.error.message,
        });
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      let user: any = {
        placeId: this.placeId || '',
        firstName: this.form.value.firstName || '',
        lastName: this.form.value.lastName || '',
        username: this.form.value.username || '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || '',
      };

      this.loading = true;
      // on va interroger notre api via le service authService
      this.authService
        .signUp(user, this.signUpAsManager)
        .pipe(
          finalize(() => {
            this.loading = false; // ← toujours exécuté
          })
        )
        .subscribe({
          next: (response) => {
            this.messageService.setMessage({
              text: response.message!,
              type: 'success',
            });
            this.router.navigate(['/signin']);
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
                //console.log('Field error:', fieldError.field, fieldError.message);
              }
            }
          },
        });
    } else {
      //console.log('Form is invalid');
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
}
