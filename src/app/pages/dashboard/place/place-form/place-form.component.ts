import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { nameValidator } from '../../../../validators/nameValidator';
import { addressValidator } from '../../../../validators/addressValidator';
import { PlaceService } from '../../../../services/place.service';
import { MessageService } from '../../../../services/message.service';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-place-form',
  imports: [ReactiveFormsModule],
  templateUrl: './place-form.component.html',
  styleUrl: './place-form.component.css',
})
export class PlaceFormComponent {
  private readonly router = inject(Router);
  constructor(
    private readonly placeService: PlaceService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService
  ) {}

  loading = false;

  form = new FormGroup({
    name: new FormControl(null, [Validators.required, nameValidator()]),
    address: new FormControl(null, [Validators.required, addressValidator()]),
  }); // Ajout du validateur de correspondance);

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;

      let place: any = {
        userId: this.authService.getUserId(),
        name: this.form.value.name || '',
        address: this.form.value.address || '',
        createdAt: null,
      };

      this.placeService
        .createPlace(place)
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
            this.router.navigate(['dashboard/place/list']);
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
      this.messageService.setMessage({
        text: 'Form is invalid',
        type: 'error',
      });
    }
  }
}
