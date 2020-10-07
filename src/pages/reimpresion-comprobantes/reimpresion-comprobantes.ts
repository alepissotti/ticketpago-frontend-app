import {Component,ViewChild} from '@angular/core';
import { IonicPage , LoadingController ,NavController} from 'ionic-angular';
import {ErrorProvider, VentaProvider , UsuarioProvider} from "../../providers/providers";
import {INGRESO_PUNTO_VENTA_PAGE} from "../pages";




@IonicPage()
@Component({
  selector: 'reimpresion-comprobantes',
  templateUrl: 'reimpresion-comprobantes.html'
})

export class ReimpresionComprobantesPage {

operacionId : string;
fechaDesde: any ;
fechaHasta: any;
operaciones: any[];
message: string;
selectedOperacion: Array<number>;
seleccion : boolean;
selectAll : boolean;
puntoVenta : any;


@ViewChild('nroOperacionInput') nroOperacionInput;

constructor(public loadingCtrl : LoadingController,
            public navCtrl : NavController,
            public venta : VentaProvider,
            public error : ErrorProvider,
            public usuario : UsuarioProvider,
            ) {

              this.fechaDesde = new Date().toISOString();
              this.fechaHasta = new Date().toISOString();
              this.selectedOperacion = [];
              this.operaciones = [];
              this.puntoVenta = this.usuario.getPuntoVenta().nombre;
              this.operacionId = null;
              this.seleccion = false;
              this.selectAll = false;
  
}

  ionViewDidLoad() {
    this.inicializarFocusEnNroOperacionInput();

  }

  inicializarFocusEnNroOperacionInput() {
    setTimeout(() => {
      this.nroOperacionInput.value = '';
      this.nroOperacionInput.setFocus();
    }, 500);
  }

  operacionClicked(id) {
    let index = this.selectedOperacion.indexOf(id);
    if (index > -1) {
      this.selectedOperacion.splice(index, 1);
      if (this.selectedOperacion.length==0) this.selectAll = this.seleccion = false;
    } else {
      this.selectedOperacion.push(id);
      if (this.selectedOperacion.length == this.operaciones.length) this.selectAll = this.seleccion = true;

    }
  }

  salirClicked() {
    this.navCtrl.pop();
  }

  seleccionar() {
     return this.seleccion;
   }

   cambiarSeleccion() {
    this.seleccion = ! (this.seleccion);
   if (this.seleccion) {
     this.seleccionarTodo();

   }
   else {
     this.selectedOperacion = [];

    }
 
  }
  estaSeleccionado(idOperacion) {
    let id = this.selectedOperacion.indexOf(idOperacion);
    if (id > -1) return true;
    else return false;
  }

  seleccionarTodo() {
    for (let i=0 ; i < this.operaciones.length ; i++) {
      let id = this.operaciones[i].operacion_id;
      if (!this.estaSeleccionado(id)) this.operacionClicked(id)
    }
  }

  limpiarTodo() {
    this.selectAll = false;
    for (let i=0 ; i < this.operaciones.length ; i++) {
      let id = this.operaciones[i].operacion_id;
      if (this.estaSeleccionado(id)) this.operacionClicked(id)
    }

  }

  buscarOperacionesVendidas() {
    if (this.selectAll) this.limpiarTodo()
    let loading = this.loadingCtrl.create();
    loading.present();
    
    let punto_venta_id = this.usuario.getPuntoVenta().id;
    let fechaDesde = this.dateFormat(this.fechaDesde);
    let fechaHasta = this.dateFormat(this.fechaHasta);
    this.selectedOperacion = [];
    this.operaciones = [];

    this.venta.getOperacionesPorPuntoDeVenta(punto_venta_id).then(response => {
      this.operaciones = response;
      if (this.operacionId) {
        this.operaciones = this.operaciones.filter(operacion => operacion.nro_operacion.toString() === this.operacionId);
      }
      if (this.fechaDesde && ( !this.numeroOperacionAsignado() ) ) {
        this.operaciones = this.operaciones.filter(operacion => this.compareDateDesde(fechaDesde,operacion.operacion_fecha) === true);
      }
      if (this.fechaHasta && ( !this.numeroOperacionAsignado() ) ) {
        this.operaciones = this.operaciones.filter(operacion => this.compareDateHasta(fechaHasta,operacion.operacion_fecha) === true);
      }
      this.message = (this.operaciones.length) ? 'Seleccione alguna de las operaciones para emitir comprobantes de pago:' : 'No hay operaciones';
      loading.dismissAll();
      this.inicializarFocusEnNroOperacionInput();
    }).catch(error => {
      error.logLevel = 'error';
      this.error.handle(error);
      loading.dismissAll();
    })
  }

  numeroOperacionAsignado() {
    return ((this.operacionId != null) && (this.operacionId != ''));
  }

  dateFormat(fecha) {
    let dateFecha = new Date(fecha);
    let dateDia = (dateFecha.getDate().toString().length === 1) ?'0'+dateFecha.getDate().toString() :dateFecha.getDate().toString();
    let dateMes = (dateFecha.getMonth().toString().length === 1) ?'0'+(dateFecha.getMonth() + 1).toString() :(dateFecha.getMonth() + 1).toString();
    let dateFecha2 = dateDia.toString() + "-" + dateMes.toString() + "-" + dateFecha.getFullYear().toString();
    return dateFecha2.toString();
  }

  compareDateDesde(dateUsuario : string, dateResponse: string) {
    let diaUsuario = parseInt(dateUsuario.split('-')[0]);
    let mesUsuario = parseInt(dateUsuario.split('-')[1]);
    let añoUsuario = parseInt(dateUsuario.split('-')[2]);
    
    let diaResponse = parseInt(dateResponse.split('-')[0]);
    let mesResponse = parseInt(dateResponse.split('-')[1]);
    let añoResponse = parseInt(dateResponse.split('-')[2]);

    if (añoResponse < añoUsuario) {
      return false;
    } else {
      if ( (añoResponse == añoUsuario) && (mesResponse < mesUsuario) ) {
        return false;
      } else {
        if ( (mesResponse == mesUsuario) && (diaResponse < diaUsuario) ) {
          return false;
        }
      }
    }
    return true;
  }

  compareDateHasta(dateUsuario : string, dateResponse: string) {
    let diaUsuario = parseInt(dateUsuario.split('-')[0]);
    let mesUsuario = parseInt(dateUsuario.split('-')[1]);
    let añoUsuario = parseInt(dateUsuario.split('-')[2]);
    
    let diaResponse = parseInt(dateResponse.split('-')[0]);
    let mesResponse = parseInt(dateResponse.split('-')[1]);
    let añoResponse = parseInt(dateResponse.split('-')[2]);

    if (añoResponse > añoUsuario) {
      return false;
    } else {
      if ( (añoResponse == añoUsuario) && (mesResponse > mesUsuario) ) {
        return false;
      } else {
        if ( (mesResponse == mesUsuario) && (diaResponse > diaUsuario) ) {
          return false;
        }
      }
    }
    return true;
  }

  emitirComprobantes() {
    this.venta.imprimirComprobanteVentaCuentaTercerosGet(this.usuario, 
      {'operacionesIds': this.getOperacionesIdsComprobantes() , 'loteId' : null});

  }

  getOperacionesIdsComprobantes() {
    let operacionesIds = '';
    for (let i=0 ; i < this.selectedOperacion.length ; i++) {
      if (i === (this.selectedOperacion.length -1) ) {
        operacionesIds += this.selectedOperacion[i].toString();
      } else {
        operacionesIds += this.selectedOperacion[i].toString() + ',';
      }
    }
    return operacionesIds;
  }

}