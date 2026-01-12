import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './api-url';

export interface FileItem {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  path: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private http: HttpClient) { }

  getFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${apiUrl}/files`);
  }

  uploadFile(file: File): Observable<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileItem>(`${apiUrl}/files`, formData);
  }

  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${apiUrl}/files/${id}`);
  }
}
