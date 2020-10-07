import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";

/*
  Generated class for the DireccionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DireccionProvider {

    constructor(public api: ApiProvider) {
    }

    getPaises(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.postToUrlBackend("buscarpaises", {datos: {}}).then(response => {
                resolve(response.data);
            }).catch( error => {
                reject(error);
            });  
        });
    }

    getProvincias(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.postToUrlBackend("buscarprovincias", {datos: {pais: id}}).then(response => {
                resolve(response.data);
            }).catch( error => {
                reject(error);
            });  
        });
    }

    getLocalidades(id:number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.postToUrlBackend("buscarlocalidades", {datos: {provincia: id}}).then(response => {
                resolve(response.data);
            }).catch( error => {
                reject(error);
            });
        })
    }

    getDireccion(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.postToUrlBackend("datosdireccionenvios", {}).then(response => {
                resolve(response.data);
            }).catch( error => {
                reject(error);
            });
        })
    }

    registrarDireccion(direccion): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.postToUrlBackend("persona/registrardireccionenvios", direccion).then(response => {
                resolve(response.data);
            }).catch( error => {
                reject(error);
            });
        })
    }
}
