import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../../../../services/place.service';
import { RouterLink } from '@angular/router';
import { Place } from '../../../../models/Place';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../partials/spinner/spinner.component';

@Component({
  selector: 'app-place-list',
  imports: [RouterLink, DatePipe, SpinnerComponent],
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css'],
})
export class PlaceListComponent implements OnInit {
  constructor(private readonly placeService: PlaceService) {}
  places: Place[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.loadPlaces();
  }

  private loadPlaces() {
    this.placeService.getPlaces()
    .pipe(
      finalize(() => { this.loading = false; })
    )
    .subscribe({
      next: (places) => (this.places = places),
      error: (error) => console.error('Error loading places:', error),
    });
  }
}
