import {Component, NgZone} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CarteleraProvider} from "../../providers/cartelera/cartelera";
import {CARTELERA_ESPECTACULO_PAGE} from "../pages";
import {BuscadorTituloEspectaculoPipe} from "../../pipes/buscador-titulo-espectaculo/buscador-titulo-espectaculo";
import {BuscadorLocalidadEspectaculoPipe} from "../../pipes/buscador-localidad-espectaculo/buscador-localidad-espectaculo";
import { UsuarioProvider } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'cartelera',
  templateUrl: 'cartelera.html',
  providers: [BuscadorTituloEspectaculoPipe, BuscadorLocalidadEspectaculoPipe],
})
export class CarteleraPage {

  static readonly EVENT_ESPECTACULOS_DISPONIBLES: string = 'carteleraPage:espectaculosDisponibles';

  espectaculos: any[];
  espectaculoIdUrl: any;

  localidadBuscada: any;
  localidadesDisponibles: any[];

  loading: boolean;
  busqueda: string;
  message: string;

  zone: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              public cartelera: CarteleraProvider,
              public usuario: UsuarioProvider,
              public events: Events,
              public buscadorTituloEspectaculo: BuscadorTituloEspectaculoPipe,
              public buscadorLocalidadEspectaculo: BuscadorLocalidadEspectaculoPipe) {
    
    this.espectaculos = [];
    this.zone = new NgZone({ enableLongStackTrace: false });
    cartelera.redireccionSiEnProduccion(usuario);

    this.espectaculoIdUrl = cartelera.getParameterByName('evento');
  }

  ionViewDidLoad() {
    this.cartelera.espectaculoElegido = null;
    this.getEspectaculosDisponibles();
  }

  getEspectaculosDisponibles() {
    this.loading = true;
    this.cartelera.getCartelera().then((response) => {

        this.espectaculos = response.espectaculos_disponibles;
        this.listarLocalidadesDisponibles();
        this.events.publish(CarteleraPage.EVENT_ESPECTACULOS_DISPONIBLES);
        this.loading = false;

        if(this.espectaculoIdUrl) {
          this.espectaculos.forEach( (espectaculo) => {
            if(this.espectaculoIdUrl == espectaculo.id) {
              this.goPage(espectaculo);
            }
          });
        }

    }).catch(error => {
      this.loading = false;
      error.logLevel = 'error';
    })
  }



  listarLocalidadesDisponibles() {

    this.localidadesDisponibles = [BuscadorLocalidadEspectaculoPipe.LABEL_TODOS_LOS_ESPECTACULOS];

    this.espectaculos.forEach( (espectaculo) => {
      if(espectaculo.establecimiento.direccion) {
        let localidad = espectaculo.establecimiento.direccion.localidad.nombre;
        if (this.localidadesDisponibles.indexOf(localidad) == -1) {
          this.localidadesDisponibles.push(localidad);
        }
      }
    });
  }

  getInformacion(event) {
    let espectaculo = event.espectaculo;
    this.goPage(espectaculo);
  }

  goPage(espectaculo) {
    this.cartelera.setSelectedEspectaculo(espectaculo);
    this.navCtrl.push(CARTELERA_ESPECTACULO_PAGE);
  }
}
