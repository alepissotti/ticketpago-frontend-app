import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchableEntityProvider } from '../../app/shared/providers/searchable-entity/searchable-entity';
import { environment } from "../../environment/environment";

/*
  Generated class for the SearchableEntityTicketwayProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchableEntityTicketwayProvider extends SearchableEntityProvider {

  constructor(public http: HttpClient) {
    super(http);

  }

  getUrlBackend(): string {
    return  environment.apiConfig.backend.url;
  }

}
