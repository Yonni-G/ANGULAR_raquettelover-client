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
    return this.http.get<ApiResponse<Place[]>>(`${this.baseUrl}/place`).pipe(
      map((response) => response.data ?? []) // sécurité
    );
  }

  createPlace(place: Place): Observable<ApiResponse<Place>> {
    return this.http.post<ApiResponse<Place>>(`${this.baseUrl}/place`, place);
  }
}
