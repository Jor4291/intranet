import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getCurrentApiUrl } from './api-url';

export interface User {
  id: number;
  organization_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  last_seen_at?: string;
  created_at: string;
  updated_at: string;
  roles?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${getCurrentApiUrl()}/users`);
  }

  createUser(user: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(`${getCurrentApiUrl()}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${getCurrentApiUrl()}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${getCurrentApiUrl()}/users/${id}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${getCurrentApiUrl()}/users/${id}`);
  }
}
