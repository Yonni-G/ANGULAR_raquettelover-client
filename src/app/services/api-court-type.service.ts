import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/ApiResponse';
import { map, Observable } from 'rxjs';
import { Place } from '../models/Place';
import { CourtType } from '../models/CourtType';

@Injectable({
  providedIn: 'root',
})
export class ApiCourtTypeService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCourtType(): Observable<CourtType[]> {
    return this.http
      .get<ApiResponse<CourtType[]>>(`${this.baseUrl}/court-type`)
      .pipe(
        map((response) => response.data ?? []) // sécurité
      );
  }

}
