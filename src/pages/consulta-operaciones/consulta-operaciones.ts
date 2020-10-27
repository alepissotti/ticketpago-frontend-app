import {Component} from '@angular/core';
import { IonicPage , LoadingController ,NavController , AlertController} from 'ionic-angular';
import {ErrorProvider, VentaProvider , UsuarioProvider,MensajeProvider} from "../../providers/providers";
import {LISTADO_CONSULTA_OPERACIONES_PAGE} from '../pages';

@IonicPage()
@Component({
    selector : 'consulta-operaciones',
    templateUrl : 'consulta-operaciones.html',
})

export class ConsultaOperacionesPage {

    tipoConsultas : any[] = [
        {id : 1 , detalle : 'Operación particular'},
        {id : 2 , detalle : 'Operaciones finalizadas'},
        {id : 3 , detalle : 'Operaciones pendientes'},
        {id : 4 , detalle : 'Operaciones finalizadas y pendientes'},
    ];

    selectedTipoConsulta : any;
    nroOperacion : any;
    dniCliente : any;
    fechaDesde : any;
    fechaHasta : any;


    
    constructor(public loadingCtrl : LoadingController,
                public navCtrl : NavController,
                public alertCtrl : AlertController,
                public venta : VentaProvider,
                public usuario : UsuarioProvider,
                public error : ErrorProvider,
                public msj : MensajeProvider, 
               )
    {
        this.fechaDesde = new Date().toISOString();
        this.fechaHasta = new Date().toISOString();
    }

    salirClicked() {
        this.navCtrl.pop();
    }

    selectedTipoConsultaChange() {
        this.resetValues();
    }

    getSelectedTipoConsultaId() {
        if (this.selectedTipoConsulta) return this.selectedTipoConsulta.id;
        else return null;
    }

    seleccionoOperacionEnParticular() {
        return (this.getSelectedTipoConsultaId() === 1);
    }

    seleccionoOperacionesFinalizadasOfinalizadasPendientes() {
        return ( (this.getSelectedTipoConsultaId() === 2) || (this.getSelectedTipoConsultaId() === 4) );
    }

    resetValues() {
        this.nroOperacion = null;
        this.dniCliente = null;
        this.fechaDesde = new Date().toISOString();
        this.fechaHasta = new Date().toISOString();
    }

    buscarOperacionParticular() {
        if ((!this.nroOperacion) && (!this.dniCliente)) {
            this.msj.presentar('Error','Debe indicar Número de operación y/o DNI del cliente',null,3000);

        } else {
            let loading = this.loadingCtrl.create();
            loading.present();
            const nroOperacion = (this.nroOperacion) ?parseFloat(this.nroOperacion) : null;
            const dniCliente = (this.dniCliente) ?parseFloat(this.dniCliente) :null;
            const puntoVentaId = this.usuario.getPuntoVenta().id;
            
            let search = {
                nro_operacion : nroOperacion,
                reserva_dni : dniCliente,
                punto_venta_id : puntoVentaId
            }
    
            this.venta.buscarOperacion(search).then(response => {
                loading.dismissAll();
                if (response.length === 0) {
                    this.alertSinRegistros();
                } else {
                    const operaciones : any[] = response;
                    operaciones.sort((a, b) => {
                        if(a.id > b.id) {
                          return -1;
                        } else if(a.id < b.id) {
                          return 1;
                        } else {
                          return 0;
                        }
                      });
                    this.navCtrl.push(LISTADO_CONSULTA_OPERACIONES_PAGE,{
                        operaciones : operaciones,
                    })
                }
            }).catch(error => {
                loading.dismissAll();
                error.loglevel = 'error';
                this.error.handle(error);
            })
        }
    }

    buscarOperacionesPendientes() {
        let loading = this.loadingCtrl.create();
        loading.present();

        const operacionTipoId = 1;
        const puntoVentaId = this.usuario.getPuntoVenta().id;
        
        let search = {
            punto_venta_id : puntoVentaId,
            operacion_tipo_id : operacionTipoId
        }

        this.venta.buscarOperacion(search).then(response => {
            loading.dismissAll();
            if (response.length === 0) {
                this.alertSinRegistros();
            } else {
                const operaciones : any[] = response;
                operaciones.sort((a, b) => {
                    if(a.id > b.id) {
                      return -1;
                    } else if(a.id < b.id) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
                this.navCtrl.push(LISTADO_CONSULTA_OPERACIONES_PAGE,{
                    operaciones : operaciones,
                })
            }
        }).catch(error => {
            loading.dismissAll();
            error.loglevel = 'error';
            this.error.handle(error);
        })
    }

    buscarOperacionesFinalizadasYOFinalizadasPendientes() {
        
        if (this.fechaHasta < this.fechaDesde) {
            this.msj.presentar('Error','La fecha hasta no puede ser menor que la fecha desde',null,3000);  
        } else {
            let loading = this.loadingCtrl.create();
            loading.present();
            
            const fecha_desde = this.getFechaToString(new Date(this.fechaDesde) );
            const fecha_hasta = this.getFechaToString(new Date(this.fechaHasta) );
            const punto_venta_id = this.usuario.getPuntoVenta().id;
            const operacion_tipo_id = (this.getSelectedTipoConsultaId() === 2) ?2 :null;

            let search = {
                fecha_desde : fecha_desde,
                fecha_hasta : fecha_hasta,
                punto_venta_id : punto_venta_id,
                operacion_tipo_id : operacion_tipo_id
            }

            this.venta.buscarOperacionesPorRangoDeFechas(search).then(response => {
                loading.dismissAll();
                if (response.length === 0) {
                    this.alertSinRegistros();
                } else {
                    const operaciones : any[] = response;
                    operaciones.reverse();
                    this.navCtrl.push(LISTADO_CONSULTA_OPERACIONES_PAGE,{
                        operaciones : operaciones,
                        busquedaPorFecha : true
                    })
                }
            }).catch(error => {
                loading.dismissAll();
                error.loglevel = 'error';
                this.error.handle(error);
            })
        }

    }

    getFechaToString(fecha : Date) {
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        const fechaToString = anio.toString() + "-" + mes.toString() + "-" + dia.toString();
        return fechaToString;
    }

    buscarClicked() {
        const selectedTipoBusquedaId = this.getSelectedTipoConsultaId();
        
        switch (selectedTipoBusquedaId) {
            case 1 : {
                this.buscarOperacionParticular();
                break;
            }
            case 2 : {
                this.buscarOperacionesFinalizadasYOFinalizadasPendientes();
                break;
            }
            case 3 : {
                this.buscarOperacionesPendientes();
                break;
            }
            case 4 : {
                this.buscarOperacionesFinalizadasYOFinalizadasPendientes();
                break;
            }
            default : {
                this.msj.presentar('Error','Debe seleccionar un tipo de consulta para realizar la búsqueda',null,3000);
                break;
            }
        }
    }

    alertSinRegistros() {
        let alert = this.alertCtrl.create({
            title : 'Registros Inexistentes',
            subTitle : 'No se han encontrado registros con los parámetros utilizados.',
            buttons : [
                {text : 'Aceptar' , handler : () => {} }
            ]
        })

        alert.onWillDismiss(() => {})

        alert.present();
    }

    //Alerts para los inputs (menjor visualización en la app)
    focusNroOperacion() {
        document.getElementById('nroOperacion').blur();
        const nroOperacion = (this.nroOperacion) ?this.nroOperacion.toString() : null;
        let alert = this.alertCtrl.create({
          title : 'Número de operación',
          buttons : [
          {text : 'Cancelar' , handler : () => {} },
          {text : 'OK' , handler : (alertData) => {
            this.nroOperacion = (alertData.nroOperacionAlert) ?parseFloat(alertData.nroOperacionAlert) :null;
          } }
          ],
          inputs : [
            {type : 'number' , name : 'nroOperacionAlert' , value : nroOperacion }
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
}