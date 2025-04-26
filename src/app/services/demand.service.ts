import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demand } from '../types/demand.type';

@Injectable({
  providedIn: 'root'
})
export class DemandService {
  private apiUrl = 'http://localhost:8080/demands';

  constructor(private http: HttpClient) {}

  getAllDemands(): Observable<Demand[]> {
    return this.http.get<Demand[]>(this.apiUrl);
  }

  getDemandsByUser(userId: string): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiUrl}/user/${userId}`);
  }

  createDemand(demand: Demand): Observable<any> {
    return this.http.post(this.apiUrl, demand);
  }

  startDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/start`, {});
  }

  pauseDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/pause`, {});
  }

  continueDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/continue`, {});
  }

  closeDemand(demandId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demandId}/close`, {});
  }

  deleteDemand(demandId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${demandId}`);
  }

  updateDemand(demand: Demand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${demand.demandId}/update`, demand);
  }
} 