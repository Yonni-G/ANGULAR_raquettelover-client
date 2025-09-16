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
import { Court } from '../../../../models/Court';
import { CourtType } from '../../../../models/CourtType';
import { AuthService } from '../../../../services/auth.service';
import { CourtTypeService } from '../../../../services/court-type.service';
import { CourtService } from '../../../../services/court.service';
import { MessageService } from '../../../../services/message.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { descriptionValidator } from '../../../../validators/descriptionValidator';
import { nameValidator } from '../../../../validators/nameValidator';

@Component({
  selector: 'app-court-form',
  imports: [ReactiveFormsModule],
  templateUrl: './court-form.component.html',
  styleUrls: ['./court-form.component.css'],
})
export class CourtFormComponent implements OnInit {
  private readonly router = inject(Router);
  isEditMode: boolean = false;
  form!: FormGroup;
  loading: boolean = false;
  placeId: number | null = null;
  courtId: number | null = null;
  types: CourtType[] = [];

  constructor(
    private readonly courtService: CourtService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly spinnerService: SpinnerService,
    private readonly courtTypeService: CourtTypeService
  ) {}

  ngOnInit() {
    const idParam1 = this.route.snapshot.paramMap.get('placeId');
    this.placeId = idParam1 ? +idParam1 : null; // conversion string -> number, ou null si idParam est null
    const idParam2 = this.route.snapshot.paramMap.get('courtId');
    this.courtId = idParam2 ? +idParam2 : null; // conversion string -> number, ou null si idParam est null

    this.isEditMode = !!this.courtId;
    this.spinnerService.show();

    // on va faire une requête vers le serveur afin de récupérer tous les types de courts
    this.courtTypeService
      .getCourtType()
      .subscribe((types) => (this.types = types));
    // Initialisation du formulaire
    this.form = this.fb.group({
      type: new FormControl(this.types, [Validators.required]),
      name: new FormControl(null, [Validators.required, nameValidator()]),
      description: new FormControl(null, [
        Validators.required,
        descriptionValidator(),
      ]),
    });

    // Si édition, charger les données et pré-remplir le formulaire
    if (this.isEditMode && this.courtId !== null) {
      this.courtService
        .findById(this.courtId)
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

    let court: Court = {
      id: null, //déjà transmis par la requête
      name: formValue.name || '',
      description: formValue.description || '',
      createdAt: null,
      type: formValue.type,
      placeId: this.placeId,
      userId: this.authService.getUserId(),
    };

    this.loading = true;

    const saveObservable = this.isEditMode
      ? this.courtService.updatePlace(court) // Méthode à implémenter dans ton service
      : this.courtService.createPlace(court);

    saveObservable.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (response) => {
        this.messageService.setMessage({
          text:
            response.message ||
            (this.isEditMode
              ? 'Court modifié avec succès'
              : 'Court créé avec succès'),
          type: 'success',
        });
        this.router.navigate(['/dashboard/place/list']);
      },
      error: (err) => {
        this.messageService.setMessage({
          text:
            err.error?.error?.message || 'Connexion impossible avec le serveur',
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
