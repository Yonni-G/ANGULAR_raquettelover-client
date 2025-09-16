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

  createPlace(court: Court) {
    return this.apiCourtService.createCourt(court);
  }

  updatePlace(court: Court) {
    return this.apiCourtService.updateCourt(court);
  }

  findById(courtId: number): Observable<Court> {
    return this.apiCourtService.findById(courtId);
  }
}
