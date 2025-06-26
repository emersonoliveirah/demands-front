import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../types/demand.type';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private apiUrl = 'http://localhost:8080/demands';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = sessionStorage.getItem('auth-token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getAllDemands(): Observable<Demand[]> {
    return this.http.get<Demand[]>(this.apiUrl, this.getAuthHeaders());
  }

  getDemandsByUser(): Observable<Demand[]> {
    return this.http.get<Demand[]>(this.apiUrl, this.getAuthHeaders());
  }

  createDemand(demand: Demand): Observable<any> {
    return this.http.post(this.apiUrl, demand, this.getAuthHeaders());
  }

  startDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/start`, {}, this.getAuthHeaders());
  }

  pauseDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/pause`, {}, this.getAuthHeaders());
  }

  continueDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/continue`, {}, this.getAuthHeaders());
  }

  closeDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/close`, {}, this.getAuthHeaders());
  }

  deleteDemand(demandId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${demandId}`, this.getAuthHeaders());
  }

  updateDemand(demand: Demand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demand.demandId}/update`, demand, this.getAuthHeaders());
  }
  getAllDemandsWithToken(): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiUrl}/all`, this.getAuthHeaders());
  }
}
