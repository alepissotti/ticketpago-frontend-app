import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, AlertController} from 'ionic-angular';
import {ErrorProvider, VentaProvider, UsuarioProvider} from "../../providers/providers";
import {MensajeProvider} from "../../providers/mensaje/mensaje";
import {INGRESO_PUNTO_VENTA_PAGE,MODAL_DEVOLUCIONES_PAGE} from '../pages';

@IonicPage()
@Component({
  selector: 'devoluciones-line',
  templateUrl: 'devoluciones-line.html',
})
export class DevolucionesLinePage {

  @ViewChild('nroOperacionInput') nroOperacionInput;
  @ViewChild('montoDevolucionParcialInput') montoDevolucionParcialInput;
  
  nroOperacion : any;
  operaciones : any[];
  mensaje : string;

  tipoDevoluciones: any[] = [
      {nombre : 'Devolución Total' , esTotal : true},
      {nombre : 'Devolución Parcial' , esTotal : false}
  ]

  devolucionElegida : any;
  montoDevolucionParcial : string;

  
  constructor(private navCtrl : NavController,
              private loadingCtrl : LoadingController,
              private alertCtrl : AlertController,
              private venta : VentaProvider,
              private usuario : UsuarioProvider,
              private error : ErrorProvider,
              private msj : MensajeProvider) {
    
    this.devolucionElegida = null;
    this.nroOperacion = null;
    this.operaciones = [] ;
    this.mensaje = '';
    this.montoDevolucionParcial = null;

  }

  ionViewDidLoad() {
    this.inicializarFocusEnNroOperacionInput();
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

  inicializarFocusEnNroOperacionInput() {
    setTimeout(() => {
      this.nroOperacionInput.value = null;
      this.nroOperacionInput.setFocus();
    }, 500);
  }

  buscarOperacion() {
    this.operaciones = [];
    this.devolucionElegida = null;
    this.montoDevolucionParcial = null;
    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.venta.getOperacionFinalizada(parseInt(this.nroOperacion)).then(response => {
      this.operaciones = response;

      if (this.operaciones.length && (this.operaciones[0].operacion_medios_pago.length === 0) ){
        this.operaciones = [];
        this.mensaje = 'No se ha efectuado el pago de esta operación.';
        loading.dismissAll();
        return;
      }
      if (this.operaciones.length && !(this.operaciones[0].operacion_medios_pago[0].operacion_medio_pago_autorizacion) ){
        this.operaciones = [];
        this.mensaje = 'Operación realizada en efectivo. No corresponde devolución';
        loading.dismissAll();
        return;
      }
      this.mensaje = (this.operaciones.length) ?'' :'No se ha encontrado la operación.' 
      loading.dismissAll();
    }).catch(error => {
      error.log = 'error';
      this.error.handle(error);
      loading.dismissAll();
    })
  }

  montoDevolucionValido() {
    if ( (this.devolucionElegida) && this.devolucionElegida.esTotal) return this.devolucionElegida.esTotal;
    else {
        return (this.montoDevolucionParcial) && (this.esDecimalPositivoConPunto(this.montoDevolucionParcial) || this.esEnteroPositivo(this.montoDevolucionParcial));
    }
  }

  esEnteroPositivo(variable) {
    const expresion= new RegExp(/^\d*$/);
    return expresion.test(variable);
  }

  esDecimalPositivoConPunto(variable) {
    const expresion= new RegExp(/^[0-9]+\.\d{2}$/);
    return expresion.test(variable);
  }

  focusMontoDevolucionInput() {
    this.montoDevolucionParcial = null;
    
    if (this.devolucionElegida && !(this.devolucionElegida.esTotal) ){
      setTimeout( () => {
        this.montoDevolucionParcialInput.setFocus();
      },500);
    }
  }

  alertDevolver() {
    let alert = this.alertCtrl.create({
      title : 'Realizar Devolucion',
      subTitle : 'Esta seguro de continuar con la devolución?',
      buttons : [
        {text : 'Cancelar' , handler : () => {} },
        {text : 'Aceptar' , handler: () => { this.devolver() } }
      ] 
    })
    
    alert.present();
  }

  alertExito() {
    let alert = this.alertCtrl.create({
      title : 'Devolucion exitosa',
      subTitle : 'Se ha realizado la devolución de manera exitosa.',
      buttons : [
        {text : 'Aceptar' , handler: () => {  } }
      ] 
    });

    alert.onDidDismiss(() => { this.buscarOperacion() });
    
    alert.present();
  }

  cambioNroOperacionInput() {
    return ! ( parseInt(this.nroOperacion) === this.operaciones[0].nro_operacion );
  }

  devolver() {
    
    if (this.cambioNroOperacionInput() ) {
      this.msj.presentar('Error','Si cambia el número de operación deberá volver a realizar la búsqueda',null,5000);
      return;
    } else {
    
            const gateway = this.operaciones[0].operacion_medios_pago[0].nombre_gateway;


            switch(gateway) {
                
                case 'LINE': {
                  this.realizarDevolucionLine();
                  break;
                }

                default : {
                  this.msj.presentar('Error','No se permiten realizar devoluciones mediante este gateway',null,5000);
                  break;
                }
            }
    }

  }


  realizarDevolucionLine() {
    
    const activaEnElSistema : boolean = (this.operaciones[0].operacion_tipo_id === 2) ?true :false;
    const montoDevolucion = (this.montoDevolucionParcial) ?parseFloat(this.montoDevolucionParcial) :null;
    const operacionId = this.operaciones[0].id;
    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.venta.realizarDevolucionLine(operacionId,activaEnElSistema,montoDevolucion).then( (response) => {   
      const operacionMedioPagoDevolucionId = response.data.operacion_medio_pago_devolucion.id
      this.venta.imprimirComprobanteDevolucionesGet(this.usuario ,{"operacionMedioPagoDevolucionId" : operacionMedioPagoDevolucionId});
      loading.dismissAll();
      this.alertExito();
      
    }).catch(error => {
      loading.dismissAll();  
      this.msj.presentar('Error',error.text,null,5000);
    })
    
  }

  verDevoluciones() {
    const autorizacion = this.operaciones[0].operacion_medios_pago[0].operacion_medio_pago_autorizacion;
    this.navCtrl.push(MODAL_DEVOLUCIONES_PAGE,{
      autorizacion : autorizacion,
    });
  }
  

}