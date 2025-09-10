import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api-service';
import { Router } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../../validators/emailValidator';
import { passwordValidator } from '../../../validators/passwordValidator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly router = inject(Router);

  loading = false;

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

      // on va interroger notre api via le service apiService
      this.loading = true;

      this.apiService
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
            // Succès
            //this.router.navigate(['/dashboard/my-learning-space']);
            this.messageService.setMessage({
              text: res.message!,
              type: 'success',
            });
            //this.router.navigate(['/home']);
          },
          error: (err) => {
            console.log(err);
            // Erreur
            this.messageService.setMessage({
              text: err.error.error.message,
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
      // form invalide
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
}
