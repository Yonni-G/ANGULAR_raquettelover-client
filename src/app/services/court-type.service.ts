import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourtType } from '../models/CourtType';
import { ApiCourtTypeService } from './api-court-type.service';

@Injectable({
  providedIn: 'root',
})
export class CourtTypeService {
  constructor(private readonly apiCourtTypeService: ApiCourtTypeService) {}

  getCourtType(): Observable<CourtType[]> {
    return this.apiCourtTypeService.getCourtType();
  }
}
