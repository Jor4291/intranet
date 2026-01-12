import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getCurrentApiUrl } from './api-url';

export interface ExternalLink {
  id: number;
  organization_id: number;
  name: string;
  url: string;
  description?: string;
  icon?: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExternalLinksService {

  constructor(private http: HttpClient) { }

  getLinks(): Observable<ExternalLink[]> {
    return this.http.get<ExternalLink[]>(`${getCurrentApiUrl()}/external-links`);
  }

  createLink(link: Partial<ExternalLink>): Observable<ExternalLink> {
    return this.http.post<ExternalLink>(`${getCurrentApiUrl()}/external-links`, link);
  }

  updateLink(id: number, link: Partial<ExternalLink>): Observable<ExternalLink> {
    return this.http.put<ExternalLink>(`${getCurrentApiUrl()}/external-links/${id}`, link);
  }

  deleteLink(id: number): Observable<any> {
    return this.http.delete(`${getCurrentApiUrl()}/external-links/${id}`);
  }
}
