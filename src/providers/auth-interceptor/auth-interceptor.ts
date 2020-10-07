import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {UsuarioProvider} from "../usuario/usuario";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the AuthInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthInterceptorProvider {

  constructor(private usuario: UsuarioProvider) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from your auth service.
    const authToken = this.usuario.getToken();
    const authReq = req.clone({headers: req.headers.set('Authorization', `Bearer ${authToken}`)});
    return next.handle(authReq);
  }

}
