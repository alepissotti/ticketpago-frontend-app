import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import {Http} from "@angular/http";

/*
  Generated class for the SearchableEntityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchableEntityProvider{

  static readonly SEARCH_TYPE_ID: number = 1;
  static readonly SEARCH_TYPE_CRITERIA: number = 2;

  constructor(public http: HttpClient) {

  }

  getEntityName() {
    return '';
  }

  getUrlBackend() {
    return '';
  }

  getUrlFind() {
    return this.getUrlBackend() + "find"
  }

  getUrlSearchableCriteria() {
    return this.getUrlBackend() + "searchableCriteria"
  }

  /**
   *
   * @param {{username: string; password: string}} account
   * @returns {Promise<any>}
   */
  private find(parameters: { "searchedValue": any, "searchType": number, "criteriaId": any, "additionalCriterias": any }): Promise<any> {

    let searchableEntityParameters = {
      "entityName": this.getEntityName(),
      "searchedValue": parameters.searchedValue,
      "searchType": parameters.searchType,
      "criteriaId": parameters.criteriaId,
      "additionalCriterias": parameters.additionalCriterias
    }
    return this.http.post(this.getUrlFind(), searchableEntityParameters)
      //.timeout(this.timeout)
      .toPromise()
      .then(response => {
        return Promise.resolve(response);
        //return this.handleSuccess(response);
      })
      .catch(error => {
        let errorResponse = {
          error: error,
          text: 'Ha ocurrido un error. Intente nuevamente más tarde.'
        }
        return Promise.reject(errorResponse);
      })
  }

  public findId(parameters: {"searchedValue": any, additionalCriterias: any}): Promise<any> {

    let searchableEntityParameters = {
      "searchedValue": parameters.searchedValue,
      "searchType": SearchableEntityProvider.SEARCH_TYPE_ID,
      "criteriaId": null,
      "additionalCriterias": parameters.additionalCriterias
    }

    return this.find(searchableEntityParameters);
  }

  public findCriteria(parameters: {"searchedValue": any, "criteriaId": number, "additionalCriterias": any}): Promise<any> {
    let searchableEntityParameters = {
      "searchedValue": parameters.searchedValue,
      "searchType": SearchableEntityProvider.SEARCH_TYPE_CRITERIA,
      "criteriaId": parameters.criteriaId,
      "additionalCriterias": parameters.additionalCriterias
    }

    return this.find(searchableEntityParameters);
  }

  public searchableCriteria() {
    let searchableCriteriaParameters = {
      "entityName": this.getEntityName(),
    }
    return this.http.post(this.getUrlSearchableCriteria(), searchableCriteriaParameters)
    //.timeout(this.timeout)
      .toPromise()
      .then(response => {
        return Promise.resolve(response);
        //return this.handleSuccess(response);
      })
      .catch(error => {
        let errorResponse = {
          error: error,
          text: 'Ha ocurrido un error. Intente nuevamente más tarde.'
        }
        console.log(error);
        return Promise.reject(errorResponse);
      })
  }
}
