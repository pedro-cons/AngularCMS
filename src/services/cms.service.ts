import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthResponse } from '../models/auth.response.model';
import { DocumentNoContentResponse } from '../models/documentNoContent.response.model';
import { DocumentRequest } from '../models/document.request.model';
import { AuthRequest } from '../models/auth.request.model';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  private url = `${environment.api}`;
  public isRefreshing = false;
  public refreshTokenSubject = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private httpClient: HttpClient) {}

  authorize(credentials: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.url}/auth`, credentials);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.httpClient.get<AuthResponse>(`${this.url}/auth/refresh`).pipe(
      switchMap((token) => {
        this.storeToken(token);
        this.refreshTokenSubject.next(token);
        return new Observable<AuthResponse>((observer) => observer.next(token));
      })
    );
  }

  getStoredToken(): AuthResponse | null {
    const token = localStorage.getItem('authToken');
    return token ? JSON.parse(token) : null;
  }

  storeToken(token: AuthResponse): void {
    localStorage.setItem('authToken', JSON.stringify(token));
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  getAllNoContentDocument(): Observable<DocumentNoContentResponse[]> {
    const token = this.getStoredToken()?.bearerToken;
    if (!token) {
      return throwError('No token available');
    }

    return this.httpClient.get<DocumentNoContentResponse[]>(
      `${this.url}/documents`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  getDocumentById(documentId: string): Observable<DocumentRequest> {
    return this.httpClient.get<DocumentRequest>(
      `${this.url}/document/${documentId}`
    );
  }

  insertOrUpdateDocument(
    document: DocumentRequest
  ): Observable<HttpResponse<any>> {
    document.publishDate = new Date(document.publishDate).getTime();
    document.expiryDate = new Date(document.expiryDate).getTime();

    return this.httpClient.post<any>(`${this.url}/document`, document, {
      observe: 'response',
    });
  }

  deleteDocument(documentId: string): Observable<HttpResponse<any>> {
    return this.httpClient.delete<any>(`${this.url}/document/${documentId}`, {
      observe: 'response',
    });
  }
}
