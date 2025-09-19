import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Court } from '../models/Court';
import { Place } from '../models/Place';
import { ApiCourtService } from './api-court.service';

@Injectable({
  providedIn: 'root'
})
export class CourtService {

  constructor(private readonly apiCourtService: ApiCourtService) { }

  getCourts(): Observable<Court[]> {
    return this.apiCourtService.getCourts();
  }

  createCourt(placeId: number, court: Court) {
    return this.apiCourtService.createCourt(placeId, court);
  }

  updateCourt(placeId: number, court: Court) {
    return this.apiCourtService.updateCourt(placeId, court);
  }

  findById(placeId: number, courtId: number): Observable<Court> {
    return this.apiCourtService.findById(placeId, courtId);
  }
}
