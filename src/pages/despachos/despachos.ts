import { SearchableLoteOperacionEnvioEstadoComponent } from './../../components/searchable-lote-operacion-envio-estado/searchable-lote-operacion-envio-estado';
import { SearchableEspectaculoComponent } from './../../components/searchable-espectaculo/searchable-espectaculo';
import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Component, ViewChild } from '@angular/core';
import {IonicPage, LoadingController, NavController , NavParams} from 'ionic-angular';
import {VentaProvider} from "../../providers/providers";
import {ErrorProvider} from "../../providers/error/error";
import {INGRESO_PUNTO_VENTA_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

/**
 * Generated class for the DespachosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-despachos',
  templateUrl: 'despachos.html',
})
export class DespachosPage {

  @ViewChild('searchableEspectaculo') searchableEspectaculo: SearchableEspectaculoComponent;
  @ViewChild('searchableLoteOperacionEnvioEstado') searchableLoteOperacionEnvioEstado: SearchableLoteOperacionEnvioEstadoComponent;

  operaciones: any[];
  tipoEnvios: any[];
  message: any;
  selectedEspectaculo: any;
  selectedTipoEnvio: any;
  selectedTipoEnvioEstado: any;
  selectedOperaciones: any[];
  siguienteEnvioEstado: string;

  mostrarReimprimirLote: boolean = false;
  loteAReimprimir: any = null;

  seleccion : boolean;
  selectAll : boolean;

  cuentaTercero : boolean = false;
  empresaId : number = null;


  constructor(public venta: VentaProvider,
              public error: ErrorProvider,
              public navCtrl: NavController,
              public navParms : NavParams,
              private mensaje: MensajeProvider,
              private loadingCtrl: LoadingController,
              private usuarioProvider: UsuarioProvider ) {

    this.selectedEspectaculo = null;
    this.selectedTipoEnvio = null;
    this.selectedTipoEnvioEstado = null;
    this.selectedOperaciones = [];
    this.siguienteEnvioEstado = '';
    this.seleccion = false;
    this.selectAll = false;

    this.cuentaTercero = this.navParms.get('cuentaTercero') ?this.navParms.get('cuentaTercero') :false;
    this.empresaId = this.navParms.get('empresaId') ?this.navParms.get('empresaId') :null;

  }

  selectedTipoEnvioChanged() {
    this.limpiarOperaciones();
    this.selectedTipoEnvioEstado = null;
    this.siguienteEnvioEstado = this.selectedTipoEnvio.tipo_envio_estados[0].detalle;
  }

  selectedTipoEnvioEstadoChaged() {
    this.limpiarOperaciones();
    if(this.selectedTipoEnvioEstado) {
      if(this.selectedTipoEnvioEstado.siguiente_estado) {
        this.siguienteEnvioEstado = this.selectedTipoEnvioEstado.siguiente_estado.detalle;
      } else {
        if( this.selectedTipoEnvioEstado == 'PROCESADAS' ) {
          this.siguienteEnvioEstado = this.selectedTipoEnvio.tipo_envio_estados[0].detalle;
        } else {
          this.siguienteEnvioEstado = null;
        }
      }
    } else {
      this.siguienteEnvioEstado = this.selectedTipoEnvio.tipo_envio_estados[0].detalle;
    }
  }

  buscarOperaciones() {
    this.selectAll = this.seleccion = false;
    let loading = this.loadingCtrl.create();
    loading.present();
    this.selectAll=this.seleccion=false;

    this.limpiarOperaciones();

    let params:  any = {};

    if(this.selectedTipoEnvio && this.selectedTipoEnvio != 0) {
      params.tipoEnvioId = this.selectedTipoEnvio.id;
    }
    if(this.selectedEspectaculo && this.selectedEspectaculo != 0) {
      params.espectaculoId = this.selectedEspectaculo.id;
    }

    if (this.cuentaTercero && this.empresaId) {
      params.espectaculoId = this.empresaId;
    }

    if(this.selectedTipoEnvioEstado) {
      params.tipoEnvioEstadoId = this.selectedTipoEnvioEstado.id;
    }


    this.venta.getOperacionesSegunEnvio(params).then( response => {
      if(response.operaciones.length > 0) {
        this.operaciones = response.operaciones;

        /*Inicializo el siguiente estado en caso que sea null para imprimir entradas*/
        if(!this.selectedTipoEnvioEstado) {
          this.siguienteEnvioEstado = this.selectedTipoEnvio.tipo_envio_estados[0].detalle;
        }

      } else {
        this.message = 'No se encontraron operaciones con los parametros ingresados';
      }
      loading.dismissAll();
    }).catch( error => {
      console.log(error);
      loading.dismissAll();
    });
  }

  limpiarOperaciones() {
    this.operaciones = [];
    this.selectedOperaciones = [];
    this.message = null;
  }

  operacionClicked(id) {
    let index = this.selectedOperaciones.indexOf(id);
    if (index > -1) {
      this.selectedOperaciones.splice(index, 1);
      if (this.selectedOperaciones.length==0) this.selectAll = this.seleccion = false;
    } else {
      this.selectedOperaciones.push(id);
      if (this.selectedOperaciones.length == this.operaciones.length) this.selectAll = this.seleccion = true;
    }
  }

  setMostrarReimprimirLote(mostrar) {
    if(this.mostrarReimprimirLote != mostrar) {
      this.loteAReimprimir = null;
      this.mostrarReimprimirLote = mostrar;
    }
  }

  setLoteAReimprimir(event) {
    this.loteAReimprimir = event.searchableEntity;
  }

  reimprimirLote() {
    let id = this.loteAReimprimir.id; 

    if (this.cuentaTercero) {
      this.imprimirLoteTerceros(id);
    } else {
            this.venta.imprimirTicketsLoteGet(this.usuarioProvider, {'idLote': id});
            this.venta.imprimirEtiquetasLoteGet(this.usuarioProvider, {'idLote': id});
      }  
  }

  seguienteEstadoClicked() {
    if(this.selectedOperaciones.length == 0) {
      this.mensaje.presentar(null, 'Debe seleccionar al menos una operación.', null, 3000);
    } else {

      let loading = this.loadingCtrl.create();
      loading.present();

      this.venta.setSiguienteEstadoEnvio({'operacionesIds': this.selectedOperaciones}).then(response => {

        if((!this.cuentaTercero) && (response.imprimir_ticket)) {
          this.venta.imprimirTicketsLoteGet(this.usuarioProvider, {'idLote': response.lote_operacion_envio_estado.id});
        }

        if((!this.cuentaTercero) && (response.imprimir_comprobante_entrega)) {
          this.venta.imprimirEtiquetasLoteGet(this.usuarioProvider, {'idLote': response.lote_operacion_envio_estado.id});
        }



        this.limpiarOperaciones();
        loading.dismissAll();
        this.buscarOperaciones();

      }).catch(error => {
        console.log(error);
        loading.dismissAll();
      });

    }
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

  ionViewDidLoad() {

    let loading = this.loadingCtrl.create();
    loading.present();

    let puntoVenta = this.usuarioProvider.getPuntoVenta();

    this.searchableEspectaculo.setPuntoVenta(puntoVenta);

    this.searchableLoteOperacionEnvioEstado.setPuntoVenta(puntoVenta);

    this.venta.getTipoEnvioDisponibles().then( response => {
      this.tipoEnvios = response.tipo_envios;
      if (this.cuentaTercero) {
        this.tipoEnvios = this.tipoEnvios.filter(tipoEnvio => tipoEnvio.detalle === 'Boletería');
        this.tipoEnvios[0].detalle = 'Entrega';
        this.tipoEnvios[0].tipo_envio_estados = this.tipoEnvios[0].tipo_envio_estados.filter(tipoEnvioEstado => tipoEnvioEstado.detalle === 'IMPRESA');
      }
      loading.dismissAll();
    }).catch(error => {
      error.logLevel = 'error';
      this.error.handle(error);
    });



  }

  cambiarSeleccion() {
    this.seleccion = ! (this.seleccion);
   if (this.seleccion) {
     this.anularTodo();

   }
   else {
     this.selectedOperaciones = [];

    }
 
   }


   estaSeleccionado(idOperacion) {
     let id = this.selectedOperaciones.indexOf(idOperacion);
     if (id > -1) return true;
     else return false;
   }

   anularTodo() {
    let id;
    for (let i=0 ; i < this.operaciones.length ; i++) {
       id = this.operaciones[i].id
       if (!(this.estaSeleccionado(id))) {
       this.operacionClicked(id);
      }
    }
   }

   mostrarSelecciones(){
    let seleccionados = "";
      for (let i=0;i<this.selectedOperaciones.length;i++) {
        seleccionados+=this.selectedOperaciones[i] + " - ";
      }
      return seleccionados;
   }

   //Imprimir comprobantes para cuentas Terceros
   imprimirComprobantesTerceros() {
     this.venta.imprimirComprobanteVentaCuentaTercerosGet(this.usuarioProvider, 
      {'operacionesIds': this.getOperacionesIdsComprobantes() , 'loteId' : null});
      if ( (this.selectedTipoEnvioEstado.detalle!=='IMPRESA') ) {
        this.seguienteEstadoClicked();
      }else {
        this.limpiarOperaciones();
        this.buscarOperaciones();
      }
   }

   //Reimprimir lote de cuentas terceros
   imprimirLoteTerceros(loteId) {
    this.venta.imprimirComprobanteVentaCuentaTercerosGet(this.usuarioProvider, 
      {'operacionesIds': '' , 'loteId' : loteId});
   }

   getOperacionesIdsComprobantes() {
     let operacionesIds = '';
     for (let i=0 ; i < this.selectedOperaciones.length ; i++) {
       if (i === (this.selectedOperaciones.length -1) ) {
         operacionesIds += this.selectedOperaciones[i].toString();
       } else {
         operacionesIds += this.selectedOperaciones[i].toString() + ',';
       }
     }
     return operacionesIds;
   }



}
