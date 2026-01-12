import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { apiUrl } from './api-url';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  roles: any[];
  organization?: any;
}

export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(organizationSlug: string, username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiUrl}/login`, {
      organization_slug: organizationSlug,
      username,
      password,
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiUrl}/register`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.http.post(`${apiUrl}/logout`, {}).subscribe();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  updateProfile(profileData: { first_name: string; last_name: string; email: string }): Observable<User> {
    return this.http.put<User>(`${apiUrl}/profile`, profileData).pipe(
      tap(updatedUser => {
        // Update the current user in localStorage and BehaviorSubject
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  changePassword(passwordData: { current_password: string; password: string; password_confirmation: string }): Observable<any> {
    return this.http.post(`${apiUrl}/profile/change-password`, passwordData);
  }
}

