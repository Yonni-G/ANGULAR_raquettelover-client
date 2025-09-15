import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../../../../services/place.service';
import { RouterLink } from '@angular/router';
import { Place } from '../../../../models/Place';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../partials/spinner/spinner.component';
import { MessageService } from '../../../../services/message.service';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-place-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css'],
})
export class PlaceListComponent implements OnInit {
  constructor(
    private readonly placeService: PlaceService,
    private readonly messageService: MessageService,
    private readonly spinnerService: SpinnerService
  ) {}
  places: Place[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadPlaces();
  }

  public loadPlaces() {
    this.spinnerService.show();
    this.placeService
      .getPlaces()
      .pipe(
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({
        next: (places) => (this.places = places),
        error: (error) => {
          this.errorMessage =
            error.error?.error?.message ||
            "Erreur serveur : impossible d'accéder au serveur";
          this.messageService.setMessage({
            text: this.errorMessage!,
            type: 'error',
          });
        },
      });
  }
}
