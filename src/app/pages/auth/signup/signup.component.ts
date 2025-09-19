import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { emailValidator } from '../../../validators/emailValidator';
import { passwordValidator } from '../../../validators/passwordValidator';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { finalize } from 'rxjs';
import { nameValidator } from '../../../validators/nameValidator';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly allowedRoles = ['player', 'manager']; // Paramètres attendus

  signInAsManager = false;
  loading = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const signInAs = paramMap.get('signInAs');
      // Traitement avec signInAs
      if (!this.allowedRoles.includes(signInAs!)) {
        // Redirection ou affichage d’une erreur
        this.router.navigate(['/404']);
      }
      this.signInAsManager = signInAs === 'manager'
    });
  }

  // ici les formControl communs
  form = new FormGroup(
    {
      firstName: new FormControl(null, [Validators.required, nameValidator()]),
      lastName: new FormControl(null, [Validators.required, nameValidator()]),
      username: new FormControl('', [Validators.required, emailValidator()]),
      password: new FormControl('', [Validators.required, passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  );


  onSubmit() {
    if (this.form.valid) {
      let user: any = {
        firstName: this.form.value.firstName || '',
        lastName: this.form.value.lastName || '',
        username: this.form.value.username || '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || ''        
      };

      this.loading = true;
      // on va interroger notre api via le service authService
      this.authService
        .signUp(user, this.signInAsManager)
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
