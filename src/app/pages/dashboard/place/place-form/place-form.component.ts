import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Place } from '../../../../models/Place';
import { AuthService } from '../../../../services/auth.service';
import { MessageService } from '../../../../services/message.service';
import { PlaceService } from '../../../../services/place.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { addressValidator } from '../../../../validators/addressValidator';
import { codeLieuValidator } from '../../../../validators/codeLieuValidator';
import { nameValidator } from '../../../../validators/nameValidator';

@Component({
  selector: 'app-place-form',
  imports: [ReactiveFormsModule],
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.css'],
})
export class PlaceFormComponent implements OnInit {
  private readonly router = inject(Router);
  isEditMode: boolean = false;
  form!: FormGroup;
  loading: boolean = false;
  placeId: number | null = null;

  constructor(
    private readonly placeService: PlaceService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('placeId');
    this.placeId = idParam ? +idParam : null; // conversion string -> number, ou null si idParam est null

    this.isEditMode = !!this.placeId;
    this.spinnerService.show();

    // Initialisation du formulaire
    this.form = this.fb.group({
      codeLieu: new FormControl(null, [
        Validators.required,
        codeLieuValidator(),
      ]),
      name: new FormControl(null, [Validators.required, nameValidator()]),
      address: new FormControl(null, [Validators.required, addressValidator()]),
    });

    // Si édition, charger les données et pré-remplir le formulaire
    if (this.isEditMode && this.placeId !== null) {
      this.placeService
        .findById(this.placeId)
        .pipe(finalize(() => this.spinnerService.hide()))
        .subscribe({
          next: (data) => this.form.patchValue(data),
          error: (err) => {
            this.spinnerService.hide();
            this.messageService.setMessage({
              text: err.error.error.message || 'Erreur lors du chargement',
              type: 'error',
            });
            this.router.navigate(['/dashboard/place/list']);
          },
        });
    } else {
      this.spinnerService.hide();
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.messageService.setMessage({
        text: 'Le formulaire est invalide !',
        type: 'error',
      });
      return;
    }

    const formValue = this.form.value;

    let place: Place = {
      id: this.placeId,// peut valoir null pour un CREATE ou passé par l'URL pour l'UPDATE
      codeLieu: formValue.codeLieu,
      name: formValue.name,
      address: formValue.address,
      createdAt: null,
      courts: null,
      userId: this.authService.getUserId(),
    };

    this.loading = true;

    const saveObservable = this.isEditMode
      ? this.placeService.updatePlace(place) // Méthode à implémenter dans ton service
      : this.placeService.createPlace(place);

    saveObservable.pipe(finalize(() => this.loading = false)).subscribe({
      next: (response) => {
        this.messageService.setMessage({
          text:
            response.message ||
            (this.isEditMode
              ? 'Lieu modifié avec succès'
              : 'Lieu créé avec succès'),
          type: 'success',
        });
        this.router.navigate(['/dashboard/place/list']);
      },
      error: (err) => {
        let errorMessage = 'Connexion impossible avec le serveur';

        if (err.error?.error?.message) {
          errorMessage = err.error.error.message;
        }
        this.messageService.setMessage({
          text: errorMessage,
          type: 'error',
        });

        if (err.error.error.fields) {
          for (let fieldError of err.error.error.fields) {
            const control = this.form.get(fieldError.field);
            if (control) {
              control.setErrors({ serverError: fieldError.message });
            }
          }
        }
      },
    });
  }
}
