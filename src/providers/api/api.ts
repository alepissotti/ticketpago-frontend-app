import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import {environment} from "../../environment/environment";

@Injectable()
export class ApiProvider {

  apiConfig: any;
  AuthorizationQueryParameterName: string;
  version: string;
  timeout: number;

  constructor(private http: Http) {
    this.apiConfig = environment.apiConfig;
    this.version = environment.version;
    this.AuthorizationQueryParameterName = environment.AuthorizationQueryParameterName;
    this.timeout = 30000;
  }

  handleSuccess(response) {
    //console.log('[WebService] URL ' + response.url + ' OK');
    return Promise.resolve(response.json());
  }

  handleError(error) {
    //console.error('[WebService] URL ' + error.url + ' ERROR: ', error);

    let errorResponse: any = null;

    switch (error.status) {
      case 403: {
        errorResponse = {
          error: error,
          text: 'Usuario o Contraseña incorrectos, por favor vuelva a ingresar los datos.'
        };
        break;
      }
      case 409: {
        errorResponse = {
          error: error,
          text: error.json().message || 'Ha ocurrido un error. Intente nuevamente más tarde.'
        };
        break;
      }
      default: {
        errorResponse = {
          error: error,
          text: 'Ha ocurrido un error. Intente nuevamente más tarde.'
        }
      }
    }

    return Promise.reject(errorResponse);

  }

  getUrlBackend(): string {
    return this.apiConfig.backend.url;
  }

  enProduccion() {
    return this.apiConfig.backend.url == 'http://www.ticketway.com.ar/twn/be/';
  }

  /**
   *
   * @param {string} apiKey
   * @param {string} url
   * @param {{card_number: number; card_expiration_month: number; card_expiration_year: number; security_code: number; card_holder_name: string}} params
   * @returns {Promise<any>}
   */
  getSpsAuthToken(apiKey: string, url: string, params: { card_number: number, card_expiration_month: number, card_expiration_year: number, security_code: number, card_holder_name: string, card_holder_identification, email }) {
    let headers = new Headers();
    headers.append('apiKey', apiKey);
    headers.append('Content-Type', 'application/json');
    headers.append('Cache-Control', 'no-cache');
    let options = new RequestOptions({headers: headers});
    return this.http.post(url + "/tokens", params, options)
      .timeout(this.timeout)
      .toPromise()
      .then(response => {
        return this.handleSuccess(response);
      })
      .catch(error => {
        return this.handleError(error);
      })
  }

  windowOpenWithAuthorization(user, url, parameters: {}) {

    let parametersString: string = '';

    let token = user.getToken();

    let parametersKeys = Object.keys(parameters);

    if(parametersKeys.length > 0) {  

      for(let i = 0; i < parametersKeys.length; i++) {
        

        if(parameters[parametersKeys[i]]) {
          parametersString += '&' + parametersKeys[i] + '=' + parameters[parametersKeys[i]];
        }
      };

    }

    window.open(this.getUrlBackend() + url + "?" + this.AuthorizationQueryParameterName + "=" + token + parametersString, '_blank' );
  }

  postToUrlBackend(url,params): Promise<any> {
    return this.http.post( this.getUrlBackend() + url, params)
    .timeout(this.timeout)
    .toPromise()
    .then(response => {
      return this.handleSuccess(response);
    })
    .catch(error => {
      return this.handleError(error);
    })
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

}
