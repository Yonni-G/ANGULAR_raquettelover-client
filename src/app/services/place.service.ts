import { Injectable } from '@angular/core';
import { ApiPlaceService } from './api-place.service';
import { Observable } from 'rxjs';
import { Place } from '../models/Place';
import { ApiResponse } from '../models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private readonly apiPlaceService: ApiPlaceService) { }

  getPlaces(): Observable<Place[]> {
    return this.apiPlaceService.getPlaces();
  }

  createPlace(place: Place) {
    return this.apiPlaceService.createPlace(place);
  }

  updatePlace(place: Place) {
    return this.apiPlaceService.updatePlace(place);
  }

  findById(id: number): Observable<Place> {
    return this.apiPlaceService.findById(id);
  }
}
