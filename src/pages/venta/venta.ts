import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController,AlertController,ModalController} from 'ionic-angular';
import {ErrorProvider, UsuarioProvider, VentaProvider,MensajeProvider} from "../../providers/providers";
import {INGRESO_PUNTO_VENTA_PAGE, MODAL_LINK_PAGO_PAGE , MEDIOS_DE_PAGO_PAGE} from "../pages";


@IonicPage()

@Component({
  selector: 'page-venta',
  templateUrl: 'venta.html',
})


export class VentaPage {
  funcionSectorId : number = null;
  nombreEmpresa : string = null;
  montoCobranza : number = null;
  dniCliente : number;
  detalleCliente : string;
  ventaReservada : any;
  enviarDatos : boolean = false;


  
  @ViewChild('montoInput') montoInput : any;

  
  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              public events: Events,
              private error: ErrorProvider,
              private user: UsuarioProvider,
              private venta: VentaProvider,
              private msj: MensajeProvider,
              private alertCtrl : AlertController,
              private modalCtrl : ModalController
              ) {
    

    this.ventaReservada = { operacion: null };
    this.getEmpresa();
    
  }

  ionViewDidEnter() {
    if (this.enviarDatos) {
      this.navCtrl.pop();
    }
}

  getEmpresa() {
    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.venta.getEspectaculosDisponibles().then(response => {
      loading.dismissAll();
      const esCobranzaCuentaTercero = response.espectaculos_disponibles[0].cobranza_cuenta_tercero;
      if (!esCobranzaCuentaTercero) {
        this.msj.presentar('error','Error: Comuniquese con el proveedor.',null,2000);
      } else {
        this.nombreEmpresa = response.espectaculos_disponibles[0].nombre;
        this.funcionSectorId = response.espectaculos_disponibles[0].first_funcion_sector.id;
      }
      
    }).catch(error => {
      loading.dismissAll();
      this.msj.presentar(error,'Hubo un error, intente nuevamente.',null,2000);
    })
  }

  generarLinkPago() {
    if (this.formValid() ) {
      let loading = this.loadingCtrl.create();
      loading.present();
  
      this.venta.registrarVentaEnCurso(this.funcionSectorId,1,true,this.montoCobranza,0,[],null).then(() => {
        const operacionId = this.venta.getVentaReservada().operacion.id;
          this.venta.registrarClienteCuentaTercero(operacionId,this.dniCliente,this.detalleCliente).then(() => {
          loading.dismissAll();
          this.modalLinkPago(operacionId);
          }).catch(error => {
            loading.dismissAll();
            error.logLevel = 'error';
            this.error.handle(error);
          })
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
      })
    }
  }

  modalLinkPago(operacionId) {
    let params = btoa(operacionId + "->" + atob(window.sessionStorage['linkPago']));
    let linkPago = this.user.urlLinkPago + params.toString();
    let linkPagoModal = this.modalCtrl.create(MODAL_LINK_PAGO_PAGE,{
        linkPago : linkPago
    });

    linkPagoModal.onWillDismiss(() => {
      this.venta.reset(true);
      this.navCtrl.pop();
    });

    linkPagoModal.present().catch(error => {
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  continuarOperacion() {
    if (this.formValid() ) {
      let loading = this.loadingCtrl.create();
      loading.present();
  
      this.venta.registrarVentaEnCurso(this.funcionSectorId,1,true,this.montoCobranza,0,[],null).then(() => {
        const operacionId = this.venta.getVentaReservada().operacion.id;
          this.venta.registrarClienteCuentaTercero(operacionId,this.dniCliente,this.detalleCliente).then(() => {
          loading.dismissAll();
          this.navCtrl.push(MEDIOS_DE_PAGO_PAGE).then(() => {
            this.enviarDatos = true;
          })
          }).catch(error => {
            loading.dismissAll();
            error.logLevel = 'error';
            this.error.handle(error);
          })
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
      })
    }
  }



  focusMonto() {
      document.getElementById('montoCobranza').blur();
      const montoCobranza = (this.montoCobranza) ?this.montoCobranza.toString() : null;
      let alert = this.alertCtrl.create({
        title : 'Monto de la operación',
        buttons : [
        {text : 'Cancelar' , handler : () => {} },
        {text : 'OK' , handler : (alertData) => {
          this.montoCobranza = (alertData.montoAlert) ?parseFloat(alertData.montoAlert) :null;
        } }
        ],
        inputs : [
          {type : 'number' , name : 'montoAlert' , value : montoCobranza }
        ]
      })

      alert.onWillDismiss(() => {});

      setTimeout(() => {
        alert.present();
      },500)

  }


  focusDniCliente() {
    document.getElementById('dniCliente').blur();
    const dniCliente = (this.dniCliente) ?this.dniCliente.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'DNI del Cliente',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.dniCliente = (alertData.dniCliente) ?parseFloat(alertData.dniCliente) :null;
      } }
      ],
      inputs : [
        {type : 'number' , name : 'dniCliente' , value : dniCliente }
      ]
    })

    alert.onWillDismiss(() => {});

    setTimeout(() => {
      alert.present();
    },500)
  }

  focusDetalleCliente() {
    const detalleCliente = (this.detalleCliente) ?this.detalleCliente.toString() : null;
    let alert = this.alertCtrl.create({
      title : 'Detalle Del Cliente',
      buttons : [
      {text : 'Cancelar' , handler : () => {} },
      {text : 'OK' , handler : (alertData) => {
        this.detalleCliente = alertData.detalleCliente;
      } }
      ],
      inputs : [
        {type : 'text' , name : 'detalleCliente' , value : detalleCliente }
      ]
    })

    alert.onWillDismiss(() => {});


    setTimeout(() => {
      alert.present();
    },500)
  }

  montoValido() {
    return ( (this.montoCobranza) && (this.montoCobranza > 0) )
  }

  dniValido() {
    if (!this.dniCliente) {
      return true;
    } else {
      const dniCliente = this.dniCliente.toString();
      const expresion= new RegExp(/^\d*$/);
      return ( (this.dniCliente) && (expresion.test(dniCliente)) && (dniCliente.length <= 9));
    }
  }

  formValid() {
    return (this.montoValido() && this.dniValido() );
  }




}
