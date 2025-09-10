import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { ApiService } from '../../../services/api-service';
import { Router } from '@angular/router';
import { emailValidator } from '../../../validators/emailValidator';
import { passwordValidator } from '../../../validators/passwordValidator';
import { passwordMatchValidator } from '../../../validators/passwordMatchValidator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly messageService: MessageService = inject(MessageService);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly router = inject(Router);

  loading = false;

  form = new FormGroup(
    {
      username: new FormControl('', [Validators.required, emailValidator()]),
      password: new FormControl('', [Validators.required, passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  ); // Ajout du validateur de correspondance);

  onSubmit() {
    if (this.form.valid) {

      let user: any = {
        username: this.form.value.username || '',
        password: this.form.value.password || '',
        confirmPassword: this.form.value.confirmPassword || '',
      };

      this.loading = true;
      // on va interroger notre api via le service apiService
      this.apiService
        .signUp(user)
        .pipe(
          finalize(() => {
            this.loading = false; // ← toujours exécuté
          })
        )
        .subscribe({
          next: (response) => {
            //console.log('Registration successful', response);
            this.messageService.setMessage(
              { text: response.message!, type: 'success' }
            );
            //this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Registration failed', err);
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
      //console.log('Form is invalid');
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
}
