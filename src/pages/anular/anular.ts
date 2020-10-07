import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {ErrorProvider, VentaProvider} from "../../providers/providers";
import {INGRESO_PUNTO_VENTA_PAGE} from "../pages";
import {MensajeProvider} from "../../providers/mensaje/mensaje";

@IonicPage()
@Component({
  selector: 'page-anular',
  templateUrl: 'anular.html',
})
export class AnularPage {
  loading: boolean;
  operaciones: any[];
  tipoAnulaciones: any[];
  message: string;
  search: {id?: string, dni?: string};
  anulacionElegida: any;
  selectedOperacion: Array<number>;
  seleccion : boolean;
  selectAll : boolean;

  @ViewChild('nroOperacionInput') nroOperacionInput;

  constructor(private venta: VentaProvider,
              private error: ErrorProvider,
              private mensaje: MensajeProvider,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController) {
    this.search = {};
    this.selectedOperacion = [];
    this.operaciones = [];
    this.seleccion = false;
    this.selectAll = false;


  }

  ionViewDidLoad() {
    this.inicializarFocusEnNroOperacionInput();
    this.getTipoAnulaciones();
  }

  inicializarFocusEnNroOperacionInput() {
    setTimeout(() => {
      this.nroOperacionInput.value = '';
      this.nroOperacionInput.setFocus();
    }, 500);
  }

  buscarOperacionesVendidas() {
    let loading = this.loadingCtrl.create();
    loading.present();
    let search = {
      id: this.search.id ? parseInt(this.search.id) : null
    };

    this.selectedOperacion = [];
    this.operaciones = [];
    this.anulacionElegida = null;

    this.venta.getOperacionesVendidas(search).then(response => {
      this.operaciones = response;
      this.message = (this.operaciones.length) ? 'Seleccione alguna de las operaciones para anular ubicaciones:' : 'No hay operaciones';
      loading.dismissAll();
      this.inicializarFocusEnNroOperacionInput();
    }).catch(error => {
      error.logLevel = 'error';
      this.error.handle(error);
      loading.dismissAll();
    })
  }

  getTipoAnulaciones() {
    this.venta.getTipoAnulacionesDisponibles().then( response => {
      this.tipoAnulaciones = response;
    }).catch( error => {
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  ubicacionClicked(id) {
    let index = this.selectedOperacion.indexOf(id);
    if (index > -1) {
      this.selectedOperacion.splice(index, 1);
      if (this.selectedOperacion.length==0) this.selectAll = this.seleccion = false;
    } else {
      this.selectedOperacion.push(id);

    }
  }

  anularClicked(id) {
    if(!this.anulacionElegida) {
      alert('Debe elegir el tipo de anulación que desea realizar');
    } else {
      if (this.selectedOperacion.length > 0) {
        this.mensaje.presentar(
          'Confirmar cancelar venta',
          '¿Esta seguro/a que desea anular las ubicaciones seleccionadas?',
          { buttons: [
                      {
                        text: 'Cancelar',
                        role: 'cancel'
                      }, {
                        text: 'Continuar',
                        handler: () => {
                          this.anular(id);
                        }
                      }
                    ]}
        )
      } else {
        this.mensaje.presentar(null, 'Debe seleccionar al menos una ubicación.', null, 3000);
      }
    }
  }

  anular(id) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.venta.anular(id, this.selectedOperacion, this.anulacionElegida).then(response => {
      loading.dismissAll();
      this.showMessage('Operacion Exitosa','Las ubicaciones de la operación fueron anuladas con exito');
      this.selectedOperacion = [];
      this.operaciones = [response.operacion];
    }).catch(error => {
      loading.dismissAll();
      this.showMessage('Ha ocurrido un error', 'Lamentablemente, no se ha podido anular la operación, intente nuevamente.')
      error.logLevel = 'error';
      this.error.handle(error);
    })
  }

  showMessage(title, message) {
    this.mensaje.presentar(title, message, {buttons: [{ text: 'Aceptar' }]});
  }

  salirClicked() {
    this.navCtrl.setRoot(INGRESO_PUNTO_VENTA_PAGE);
  }

  cambiarSeleccion() {
    this.seleccion = ! (this.seleccion);
   if (this.seleccion) {
     this.anularTodo();

   }
   else {
     this.selectedOperacion = [];

    }
 
  }

   seleccionar(estado) {
    if (estado == 'ANULADA') return false;
    else return this.seleccion;
   }

   estaSeleccionado(idOperacion) {
     let id = this.selectedOperacion.indexOf(idOperacion);
     if (id > -1) return true;
     else return false;
   }

   
    anularTodo() {
     for (let i=0 ; i < this.operaciones[0].operacion_funcion_sectores.length ; i++ ) {
       let id;
        for (let j=0 ; j < this.operaciones[0].operacion_funcion_sectores[i].ubicaciones.length ; j++ ) {
         id = this.operaciones[0].operacion_funcion_sectores[i].ubicaciones[j].id;
           if ((!this.estaSeleccionado(id)) && this.seleccionar(this.operaciones[0].operacion_funcion_sectores[i].ubicaciones[j].ubicacion_estado.nombre)){
            this.ubicacionClicked(id);
          }
        }
      }
    }  

   mostrarOperaciones(){
    let  operaciones  = "";
    for (let i=0;i<this.selectedOperacion.length;i++) {
      operaciones += this.selectedOperacion[i] + " - ";
    }
    return operaciones;
   }

  

}
