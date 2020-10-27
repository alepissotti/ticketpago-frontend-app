import { TurnoProvider } from './../turno/turno';
import {Injectable} from '@angular/core';
import {ApiProvider} from "../api/api";
import {LineProvider} from "../line/line";
import { resolveDefinition } from '@angular/core/src/view/util';

@Injectable()
export class VentaProvider {

  ventasReservadas: any;
  ventaEnCurso: any;
  puntosDeVenta: any;
  operacionId: number;
  operacion: any;

  constructor(public api: ApiProvider,
              public turnoProvider: TurnoProvider,
              public line: LineProvider) {
    this.ventaEnCurso = {};
  }

  getVentaEnCurso() {
    return this.ventaEnCurso;
  }

  getVentaReservada() {
    return this.ventasReservadas;
  }

  getOperacionFuncionSectorIdActual() {
    return this.ventasReservadas.operacion_funcion_sector_id;
  }

  getOperacionId() {
    if (this.ventasReservadas && this.ventasReservadas.operacion) {
      return this.ventasReservadas.operacion.id;
    } else {
      return null;
    }
  }

  getOperacionNroOperacion() {
    if(this.ventasReservadas && this.ventasReservadas.operacion) {
      return this.ventasReservadas.operacion.nro_operacion;
    } else {
      return null;
    }
  }

  reset(skipCancel?: boolean): Promise<any> {
    if(this.ventaEnCurso.espectaculo) {
      this.turnoProvider.cancelarTurno(this.ventaEnCurso.espectaculo.id);
    }

    if (!skipCancel) {
      return new Promise( (resolve, reject) => {this.cancelarVentaReservada().then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      }) });
    }

    delete this.ventasReservadas;
    this.ventaEnCurso = {};

  }

  getEspectaculosDisponibles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/espectaculos", {}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  setSelectedEspectaculo(espectaculo) {
    this.ventaEnCurso.espectaculo = espectaculo;
  }

  getFuncionesDisponibles(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/funciones", {espectaculoId: id}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  setSelectedFuncion(funcion) {
    this.ventaEnCurso.funcion = funcion;
  }

  getSectoresDisponibles(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/funcionsectores", {funcionId: id}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  getDetalleSectoresFuncion(id) {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("detallefuncionproductores", {funcionId: id}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  setSelectedSector(sector) {
    this.ventaEnCurso.sector = sector;
  }

  getPlanoSector(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/funcionplanosectores",{funcionSectorId: id}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  getFuncionPlanoConfiguracion({funcionId, planoConfiguracionId}): Promise<any> {
    return new Promise((resolve,reject) => {
      this.api.postToUrlBackend("detallefuncionplanoconfiguraciones",{'funcionId': funcionId, 'planoConfiguracionId': planoConfiguracionId}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  registrarVentaEnCurso(id: number, ubicaciones: Array<number> | number,
    cobranzaCuentaTercero : boolean ,precioCuentaTercero:number ,cargoServicioTercero:number,
    funcionSectoresConDiferencial:any,transaccionTerceroId : number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/registrarventas", {
        funcionSectorId: id,
        ubicaciones: ubicaciones || 1,
        cobranzaCuentaTercero : cobranzaCuentaTercero,
        precioCuentaTercero : precioCuentaTercero,
        cargoServicioTercero : cargoServicioTercero,
        funcionSectoresConDiferencial : funcionSectoresConDiferencial,
        transaccionTerceroId : transaccionTerceroId,
        operacionId: (this.ventasReservadas && this.ventasReservadas.operacion) ? this.ventasReservadas.operacion.id : null
      }).then(response => {
        this.ventasReservadas = response.data;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  cancelarVentaReservada(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.ventasReservadas && this.ventasReservadas.operacion && this.ventasReservadas.operacion.id) {
        let id = this.ventasReservadas.operacion.id;
        delete this.ventasReservadas;
        this.api.postToUrlBackend("venta/cancelarventas", {operacionId: id}).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error);
        })
      } else {
        resolve(false);
      }
    })
  }

  getDescuentosAplicables(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/listardescuentosaplicables", {operacionFuncionSectorId: id}).then(response => {
        this.ventaEnCurso.descuentosAplicables = response.data;
        resolve(this.ventaEnCurso.descuentosAplicables);
      }).catch(error => {
        reject(error);
      })
    })
  }

  registrarDescuento(descuentos: Array<{ id: number, codigo?: string }>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/registrardescuentos", {
        operacionFuncionSectorId: this.ventasReservadas.operacion_funcion_sector_id,
        espectaculoDescuentos: descuentos[0].id ? descuentos : []
      }).then(response => {
        this.ventasReservadas = response.data;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  getMediosDePagoDisponibles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/mediospagosdisponibles", {operacionId: this.ventasReservadas.operacion.id}).then(response => {
        this.ventaEnCurso.mediosDePago = response.data;
        resolve(this.ventaEnCurso.mediosDePago);
      }).catch(error => {
        reject(error);
      })
    })
  }

  private registrarMedioDePago(id: number, mailComprobante: string, token): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/registrarmediospagos", {
        operacionId: (this.getOperacionId() !== null) ?this.ventasReservadas.operacion.id :this.operacionId,
        planCuotaId: id,
        mailComprobante: mailComprobante,
        token: token
      }).then(response => {
        if ( this.getOperacionId() !== null) this.ventasReservadas.operacion = response.data.operacion;
        else this.operacion = response.data.operacion;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  private authorizePayment(apiKey: string, spsUrl: string, cardData: { card_number: number, card_expiration_month: number, card_expiration_year: number, security_code: number, card_holder_name: string, card_holder_identification, email }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.getSpsAuthToken(apiKey, spsUrl, cardData).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      })
    })
  }

  pagar(cuotaId: number, spsApiKey?: string, spsUrl?: string, cardData?: { card_number: number, card_expiration_month: number, card_expiration_year: number, security_code: number, card_holder_name: string, card_holder_identification, email}, mailComprobante?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let spsToken = null;
      if (spsApiKey && cardData && spsUrl) {
        this.authorizePayment(spsApiKey, spsUrl, cardData).then(data => {
          spsToken = data;
          spsToken.email = cardData.email;
          this.registrarMedioDePago(cuotaId, mailComprobante, spsToken).then(response => {
            resolve();
          }).catch(error => {
            reject(error);
          })
        }).catch( error=>{
          reject(error);
        });
      } else {
        this.registrarMedioDePago(cuotaId, mailComprobante, spsToken).then(() => {
          resolve();
        }).catch(error => {
          reject(error);
        })
      }
    })
  }

  pagarLineWeb(cuotaId: number, ApiKey: string, LineUrl: string, paramsToken : any , mailComprobante: string, ultimosDigitos : number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/registrarmedioslinepagos", {
        operacionId: (this.getOperacionId() !== null) ?this.ventasReservadas.operacion.id :this.operacionId,
        planCuotaId: cuotaId,
        mailComprobante: mailComprobante,
        ultimosDigitos: ultimosDigitos,
        apiKey: ApiKey,
        lineUrl: LineUrl,
        token: this.line.getBodyRequestLineAuthorizationWeb(paramsToken)
      }).then(response => {
        if ( this.getOperacionId() !== null) this.ventasReservadas.operacion = response.data.operacion;
        else this.operacion = response.data.operacion;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  realizarDevolucionLine(operacionId : number,activaEnElSistema : boolean, montoDevolucion : any): Promise<any> {
    
    let params = {
      datos : {
        operacionId : operacionId,
        activaEnElSistema : activaEnElSistema,
        montoDevolucion : montoDevolucion,
      }
    }
    return new Promise((resolve,reject) => {
        this.api.postToUrlBackend("venta/realizardevolucionlines",params)
        .then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        })
    })
    
  }

  getPuntosDeVenta(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/puntosventapreimpresas", {}).then(response => {
        this.puntosDeVenta = response.data.puntos_venta;
        resolve(this.puntosDeVenta);
      }).catch(error => {
        reject(error);
      })
    })
  }

  preimprimir(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/preimprimirventas", {operacionId: this.ventasReservadas.operacion.id, puntoVentaId: id}).then(response => {
        this.ventasReservadas.operacion = response.data.operacion;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  searchClient(dni: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("persona/buscarpersonas", {datos: {nroDocumento: dni}}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  reservar(datosPersona:{ personaId?: number, sexo?: string, nroDocumento?: number, tipoDocumento?: number, email?: string, apellido?: string, nombres?: string, reserva_dni?:number , reserva_detalle?:string, telefono?: { caracteristica?: string, numero?: string } }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend( "venta/reservarventas", {operacionId: this.ventasReservadas.operacion.id, datosPersona}).then(response => {
        this.ventasReservadas.operacion = response.data.operacion;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  getReservas(params: { nro_operacion?: number, reserva_dni?: number , reserva_detalle?:string , espectaculo_id?: number}): Promise<any> {
    let param: any = {};
    if (params.nro_operacion) {
      param.nroOperacion = params.nro_operacion;
    }
    if (params.reserva_dni) {
        param.reserva_dni = params.reserva_dni;
    }
    if (params.reserva_detalle) {
      param.reserva_detalle = params.reserva_detalle;
    }
    if (params.espectaculo_id) {
      param.operacionFuncionSectores = {
        funcionSector : {
          funcion : {
            espectaculo : {
              id : params.espectaculo_id
            }
          }
        }
      };
    }

    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("buscaroperacionesreservadas", {datos: param}).then(response => {
        resolve(response.data.operaciones);
      }).catch(error => {
        reject(error);
      })
    })
  }

  continuarReserva(id: number, selectedUbicaciones: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/emitirubicaciones", {operacion: id, ubicaciones: selectedUbicaciones}).then(response => {
        this.reset();
        this.ventasReservadas = response.data;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  cancelarReserva(id: number, selectedUbicaciones: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/liberarubicaciones", {operacion: id, ubicaciones: selectedUbicaciones}).then(response => {
        this.reset();
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  getImpresionesPendientes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/listarnoimpresas", {}).then(response => {
        resolve(response.data.operaciones);
      }).catch(error => {
        reject(error);
      })
    })
  }

  getEnviosDisponibles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("envio/listarenviosdisponibles", {operacionId: this.ventasReservadas.operacion.id}).then(response => {
        this.ventaEnCurso.envios = response.data;
        resolve(this.ventaEnCurso.envios);
      }).catch(error => {
        reject(error);
      })
    })
  }

  registrarEnvio(direccionId: number, envioId: number, puntoVentaId: number, asignarDireccionDefault: boolean, personasETickets: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/registrarenvios", 
      {
        operacionId: this.ventasReservadas.operacion.id,
        direccionId: direccionId ? direccionId : null,
        envioId: envioId ? envioId : null,
        puntoVentaId: puntoVentaId ? puntoVentaId : null,
        asignarDireccionDefault: !!asignarDireccionDefault,
        personasETickets: personasETickets
      }).then(response => {
        this.ventasReservadas.operacion = response.data.operacion;
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  }

  getPuntosDeVentaParaEnvio(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("listarpuntosventahabilitados", {operacionId: this.ventasReservadas.operacion.id})
      .then(response => {
        resolve(response.data.puntos_venta);
      }).catch(error => {
        reject(error);
      })
    })
  }

  getOperacionesVendidas(params: { id: number }): Promise<any> {
    let param: any = {};
    if (params.id) {
      param.nroOperacion = params.id;
    }
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("buscaroperacionesvendidas", {datos: param})
      .then(response => {
        resolve(response.data.operaciones);
      }).catch(error => {
        reject(error);
      })
    })
  }

  buscarOperacion(params: { nro_operacion?: number, reserva_dni?: number, punto_venta_id?: number, operacion_tipo_id?: number}) : Promise<any> {
    let param : any = {}
    if (params.nro_operacion) {
      param.nroOperacion = params.nro_operacion;
    }
    if (params.reserva_dni) {
      param.reserva_dni = params.reserva_dni;
    }
    if (params.punto_venta_id) {
      param.puntoVenta = params.punto_venta_id;
    }
    if (params.operacion_tipo_id) {
      param.operacionTipo = params.operacion_tipo_id;
    }
    return new Promise( (resolve,reject) => {
      this.api.postToUrlBackend("buscaroperaciones" , {datos: param})
      .then(response => {
        resolve(response.data.operaciones);
      }).catch(error => {
        reject(error);
      })
    })
  }

  buscarOperacionesPorRangoDeFechas(params: {fecha_desde: string, fecha_hasta: string, punto_venta_id?: number, operacion_tipo_id?: number}) : Promise<any> {
    let param : any = {
      fechaDesde : params.fecha_desde,
      fechaHasta : params.fecha_hasta
    }
    if (params.punto_venta_id) {
      param.puntoVenta = params.punto_venta_id;
    }
    if (params.operacion_tipo_id) {
      param.operacionTipo = params.operacion_tipo_id;
    }
    return new Promise ( (resolve,reject) => {
      this.api.postToUrlBackend("buscaroperacionesporrangodefechas",{datos: param})
      .then(response => {
        resolve(response.data.operaciones);
      }).catch(error => {
        reject(error);
      })
    })
  } 

  anular(id: number, selectedUbicaciones: number[], anulacionElegida: number): Promise<any> {
    let param = {
      operacionId: id,
      operacionUbicacionesIds: selectedUbicaciones,
      tipoMovimientoId: anulacionElegida
    }
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/anularubicaciones", param)
      .then(response => {
        this.reset();
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  getTipoAnulacionesDisponibles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("listartipoanulaciones", {})
      .then(response => {
        resolve(response.data.anulaciones);
      }).catch(error => {
        reject(error);
      })
    })
  }

  tieneEnvio() {
    return (this.ventasReservadas.operacion && this.ventasReservadas.operacion.operacion_envio);
  }

  getTipoEnvioDisponibles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("envio/buscartipoenvios", {}).then(response => {
        resolve(response.data);
      }).catch(error => {
        resolve(error);
      })
    })
  }

  getOperacionesSegunDniTitularTarjeta(params: { dni: string}): Promise<any> {
    
    return new Promise((resolve, reject) => {
      
      this.api.postToUrlBackend("venta/listarimpresasbyparameters",{"documento_cliente_tarjeta": params.dni}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  getOperacionesAImprimirSegunDniTitularTarjeta(params: { dni: string}): Promise<any> {
    
    return new Promise((resolve, reject) => {
      
      this.api.postToUrlBackend("venta/listaroperacionesaimprimirs",{"documento_cliente_tarjeta": params.dni}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  getOperacionesSegunEnvio(params: { tipoEnvioId: number, espectaculoId: number, tipoEnvioEstadoId: number }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("envio/listaroperacionesseguntipoenvios",params).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  setSiguienteEstadoEnvio(params: { operacionesIds: any[]}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("envio/siguienteestadoenvios", params).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  imprimirTicketsLoteGet(user, params: { idLote }) {
    this.api.windowOpenWithAuthorization(user, "envio/generarticketslotes", params);
  }

  imprimirEtiquetasLoteGet(user, params: { idLote }){
    this.api.windowOpenWithAuthorization(user, "imprimircuponentregas", params);
  }

  imprimirEtiquetasLote(params: { loteId }): Promise<any> {
    let param: any = {
      "idLote": params.loteId,
    };
    return new Promise( (resolve, reject) => {
      this.api.postToUrlBackend("imprimircuponentregas", param).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  imprimirComprobanteVentaCuentaTercerosGet(user, params: { operacionesIds , loteId }){
    this.api.windowOpenWithAuthorization(user, "imprimircomprobanteventacuentaterceros", params);
  }

  imprimirComprobanteVentaCuentaTerceros(params: { operacionesIds , loteId }): Promise<any> {
    let param: any = {
      "operacionesIds": params.operacionesIds,
      "loteId": params.loteId
    };
    return new Promise( (resolve, reject) => {
      this.api.postToUrlBackend("imprimircomprobanteventacuentaterceros", param).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  imprimirComprobanteDevolucionesGet(user, params: {operacionMedioPagoDevolucionId}) {
    this.api.windowOpenWithAuthorization(user, "imprimircomprobantedevoluciones", params);
  }

  imprimirComprobanteDevoluciones(params: {operacionMedioPagoDevolucionId}): Promise<any> {
    let param: any = {
      "operacionMedioPagoDevolucionId" : params.operacionMedioPagoDevolucionId,
    };
    return new Promise( (resolve,reject) => {
      this.api.postToUrlBackend("imprimircomprobantedevoluciones",param).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  listarFuncionSectoresConDiferencial(params: {espectaculoId , puntoVentaId } ): Promise<any> {
    let param: any = {
      espectaculo_id : params.espectaculoId,
      punto_venta_id : params.puntoVentaId
    }

    return new Promise( (resolve, reject) => {
      this.api.postToUrlBackend("venta/listarfuncionsectoresdiferenciales", {datos : param}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  getDetallesOperacion({ operacionId }) : Promise<any> {
    return new Promise( (resolve, reject) => {
      this.api.postToUrlBackend("detallesoperaciones", {operacionId: operacionId}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  consultarTransaccionTercero(empresaId : number , transaccionTerceroId : number) : Promise<any> {
    const params = {
      datos : {
        empresaId : empresaId,
        transaccionTerceroId : transaccionTerceroId
      }
    }
    return new Promise( (resolve, reject) => {
      this.api.postToUrlBackend("venta/consultartransaccionterceros", params).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    });
  }

  getOperacionesPorPuntoDeVenta(punto_venta_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/getoperacionesporpuntosdeventas", {datos: { punto_venta_id : punto_venta_id} })
      .then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  registrarClienteCuentaTercero(operacionId : number , clienteDni : number , clienteDetalle : string ) : Promise<any> {
    const params = {
      datos : {
        operacionId : operacionId,
        clienteDni : clienteDni,
        clienteDetalle : clienteDetalle
      }
    }
    return new Promise( (resolve, reject) => {
      this.api.postToUrlBackend("venta/registrarclientecuentaterceros", params).then( () => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    });
  }

  consultarOperacionLinkPago(operacionId : number , puntoVentaId : number , limiteLinkPago : number) : Promise<any> {
    const params = {
      datos : {
        operacionId: operacionId,
        puntoVentaId : puntoVentaId,
        limiteLinkPago : limiteLinkPago
      }
    }
    return new Promise( (resolve,reject) => {
      this.api.postToUrlBackend("venta/consultaroperacionlinkpagos",params).then( response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  cancelarVentaLinkPago(operacionId : number): Promise<any> {
    return new Promise((resolve, reject) => {
        this.api.postToUrlBackend("venta/cancelarventas", {operacionId: operacionId}).then( () => {
          resolve();
        }).catch(error => {
          reject(error);
        })
      
    })
  }

  continuarOperacionLinkPago(operacionId : number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.postToUrlBackend("venta/mediospagosdisponibles", {operacionId: operacionId}).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject(error);
      })
    })
  }

  registrarFirmaDigital(operacionId : number, firmaDigital : string): Promise <any> {
    const params = {
      operacionId : operacionId,
      firmaDigital : firmaDigital
    }
    return new Promise( (resolve, reject) => {
      this.api.postToUrlBackend("venta/registrarfirmadigitals",params).then(() => {
        resolve();
      }).catch(error => {
        reject();
      })
    })
  }

}
