import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/ApiResponse';
import { map, Observable } from 'rxjs';
import { Court } from '../models/Court';

@Injectable({
  providedIn: 'root',
})
export class ApiCourtService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCourts(): Observable<Court[]> {
    return this.http.get<ApiResponse<Court[]>>(`${this.baseUrl}/court`).pipe(
      map((response) => response.data ?? [])
    );
  }

  createCourt(court: Court) {
    return this.http.post<ApiResponse<Court>>(`${this.baseUrl}/place/${court.placeId}/court/create`, court);
  }
  
  updateCourt(court: Court) {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/court/` + court.id, court);
  }


  findById(placeId: number): Observable<Court> {
    return this.http
      .get<ApiResponse<Court>>(`${this.baseUrl}/court/` + placeId)
      .pipe(map((response) => response.data ?? []));    
  }
}
