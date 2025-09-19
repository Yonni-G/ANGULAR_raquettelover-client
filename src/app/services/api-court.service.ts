import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/ApiResponse';
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

  createCourt(placeId:  number, court: Court) {
    return this.http.post<ApiResponse<Court>>(`${this.baseUrl}/place/${placeId}/court`, court);
  }
  
  updateCourt(placeId: number, court: Court) {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/place/${placeId}/court/` + court.id, court);
  }


  findById(placeId: number, courtId: number): Observable<Court> {
    return this.http
      .get<ApiResponse<Court>>(`${this.baseUrl}/place/${placeId}/court/` + courtId)
      .pipe(map((response) => response.data ?? []));    
  }
}
