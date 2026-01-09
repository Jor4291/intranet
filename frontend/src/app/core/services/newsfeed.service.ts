import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface NewsfeedPost {
  id: number;
  user_id: number;
  title?: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  comments?: NewsfeedComment[];
  comments_count?: number;
  likes_count?: number;
  is_liked?: boolean;
}

export interface NewsfeedComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  likes_count?: number;
  is_liked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {

  constructor(private http: HttpClient) { }

  getPosts(): Observable<NewsfeedPost[]> {
    return this.http.get<{data: NewsfeedPost[]}>(`${environment.apiUrl}/newsfeed`).pipe(
      map(response => response.data)
    );
  }

  createPost(title: string, content: string): Observable<NewsfeedPost> {
    return this.http.post<NewsfeedPost>(`${environment.apiUrl}/newsfeed`, { title, content });
  }

  commentOnPost(postId: number, content: string): Observable<NewsfeedComment> {
    return this.http.post<NewsfeedComment>(`${environment.apiUrl}/newsfeed/${postId}/comment`, { content });
  }

  likePost(postId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/newsfeed/${postId}/like`, {});
  }

  unlikePost(postId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/newsfeed/${postId}/like`);
  }

  likeComment(commentId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/newsfeed/comments/${commentId}/like`, {});
  }

  unlikeComment(commentId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/newsfeed/comments/${commentId}/like`);
  }
}
