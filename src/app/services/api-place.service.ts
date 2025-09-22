import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/ApiResponse';
import { map, Observable } from 'rxjs';
import { Place } from '../models/Place';

@Injectable({
  providedIn: 'root',
})
export class ApiPlaceService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getPlaces(): Observable<Place[]> {
    return this.http
      .get<ApiResponse<Place[]>>(`${this.baseUrl}/place`)
      .pipe(map((response) => response.data ?? []));
  }

  createPlace(place: Place) {
    return this.http.post<ApiResponse<Place>>(`${this.baseUrl}/place`, place);
  }

  updatePlace(place: Place) {
    return this.http.put<ApiResponse<any>>(
      `${this.baseUrl}/place/` + place.id,
      place
    );
  }

  findById(id: number): Observable<Place> {
    return this.http
      .get<ApiResponse<Place>>(`${this.baseUrl}/place/` + id)
      .pipe(map((response) => response.data ?? []));
  }

  findByCodeLieu(codeLieu: string): Observable<number> {
    return this.http
      .get<ApiResponse<number>>(`${this.baseUrl}/code-lieu/` + codeLieu)
      .pipe(map((response) => response.data ?? null));
  }
}
