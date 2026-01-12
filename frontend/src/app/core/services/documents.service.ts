import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiUrl } from './api-url';

export interface Document {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  path: string;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<Document[]> {
    return this.http.get<{data: Document[]}>(`${apiUrl}/documents`).pipe(
      map(response => response.data)
    );
  }

  uploadDocument(file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('type', 'company'); // Default to company documents
    return this.http.post<Document>(`${apiUrl}/documents`, formData);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${apiUrl}/documents/${id}`);
  }
}
