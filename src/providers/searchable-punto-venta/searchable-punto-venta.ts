import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {SearchableEntityTicketwayProvider} from "../searchable-entity-ticketway/searchable-entity-ticketway";

/*
  Generated class for the SearchableFuncionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchablePuntoVentaProvider extends SearchableEntityTicketwayProvider {

  constructor(public http: HttpClient) {
    super(http);
  }

  getEntityName(): string {
    return 'Punto_Venta';
  }

}
