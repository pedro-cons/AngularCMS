import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { CmsService } from '../../services/cms.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cmsService: CmsService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.cmsService.getStoredToken()?.bearerToken;

    if (token) {
      const clonedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
