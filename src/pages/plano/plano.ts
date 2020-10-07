import { ApiProvider } from './../../providers/api/api';
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Events, IonicPage, LoadingController, Navbar, NavParams, ViewController} from 'ionic-angular';
import svgPanZoom from 'svg-pan-zoom';
import Hammer from 'hammerjs';
import {ErrorProvider, VentaProvider} from "../../providers/providers";
import {environment} from "../../environment/environment";

@IonicPage()
@Component({
  selector: 'page-plano',
  templateUrl: 'plano.html',
})
export class PlanoPage {

  panZoom:any;

  /**
   * propiedad datosPlano que se le debe asignar al componente para poder traer el plano
   * correspondiente, en caso de que tenga plano.
   */
  @Input() datosPlano: any;

  @Output() seleccion = new EventEmitter<any>();

  public maxUbicacionesParaVenta: number = null;
  public sectorDiferenciales : any;

  public xlinks: any = 'http://www.w3.org/1999/xlink';
  public xmlns: any = 'http://www.w3.org/2000/svg';

  public ESTADO_UBICACION_DISPONIBLE = 1;
  public ESTADO_UBICACION_RESERVADA = 2;
  public ESTADO_UBICACION_VENDIDA = 3;
  public ESTADO_UBICACION_ANULADA = 4;

  public ESTADO_UBICACION_BLOQUEADA = 5;
  public ESTADO_UBICACION_PREIMPRESA = 6;
  public ESTADO_UBICACION_VENTA_EN_CURSO = 7;


  public ESTADO_UBICACION_EN_VENTA = 100;

  public imagen: any;
  public ubicaciones: any;

  public secciones: any = [{}];
  public ubicacionesEnVenta: any = [];

  public debug: boolean = true;
  @ViewChild('figurePlanoElement') figurePlanoElement;
  @ViewChild('svgPlanoElement') svgPlanoElement;
  @ViewChild('imagenPlano') imagenPlano;
  @ViewChild('tooltip') tooltip;
  @ViewChild('primerLineaDetalle') primerLineaDetalle;
  @ViewChild('segundaLineaDetalle') segundaLineaDetalle;
  @ViewChild('cantButacas') cantButacas;
  @ViewChild('totButacas') totButacas;

  @ViewChild(Navbar) navbar: Navbar;

  showControls: boolean = true;
  scale: number = 1;

  funcionId: any;
  planoConfiguracionId: any;

  constructor(private api: ApiProvider,
              private venta: VentaProvider,
              private error: ErrorProvider,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private loadingCtrl: LoadingController,
              public events: Events

  ) {
    this.debug = environment.debug;
    this.maxUbicacionesParaVenta = this.navParams.get('maxUbicaciones');
    this.funcionId = this.navParams.get('funcionId');
    this.planoConfiguracionId = this.navParams.get('planoConfiguracionId');
    this.maxUbicacionesParaVenta = this.navParams.get('maxUbicaciones');
    this.sectorDiferenciales = this.navParams.get('sectorDiferenciales');
  }

  zoom(){
    let eventsHandler;
    eventsHandler = {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
      init: function(options) {
        var instance = options.instance, initialScale = 1, pannedX = 0, pannedY = 0

        // Init Hammer
        // Listen only for pointer and touch events
        this.hammer = Hammer(options.svgElement, {
          inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
        })

        // Enable pinch
        this.hammer.get('pinch').set({enable: true})

        // Handle double tap
        this.hammer.on('doubletap', function(ev){
          instance.zoomIn()
        })

        // Handle pan
        this.hammer.on('panstart panmove', function(ev){
          // On pan start reset panned variables
          if (ev.type === 'panstart') {
            pannedX = 0
            pannedY = 0
          }

          // Pan only the difference
          instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
          pannedX = ev.deltaX
          pannedY = ev.deltaY
        })

        // Handle pinch
        this.hammer.on('pinchstart pinchmove', function(ev){
          // On pinch start remember initial zoom
          if (ev.type === 'pinchstart') {
            initialScale = instance.getZoom()
            instance.zoom(initialScale * ev.scale)
          }

          instance.zoom(initialScale * ev.scale)

        })

        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', (e) => { e.preventDefault(); });
      },
      destroy: function(){
        this.hammer.destroy()
      }
    }

    let options = {
      controlIconsEnabled: false,
      customEventsHandler: eventsHandler,
      center: false,
      fit: false,
      zoomScaleSensitivity: 1
    };

    this.panZoom = svgPanZoom('#svg-plano', options);

    //Centrado de la imagen del plano, aplicando zoom si el alto de la imagen es mayor que el ancho o
    //si el tamaño del contenedor DOM 'figure' es mas grande que el viewBox
    var sizes = this.panZoom.getSizes();

    var imageHeight = sizes.height;
    var viewboxHeight = sizes.viewBox.height;
    var viewboxWidth = sizes.viewBox.width;

    var figureElement = document.getElementById("projectsvg");
    if(viewboxHeight > viewboxWidth && figureElement.clientWidth > viewboxWidth) {
      this.panZoom.zoom(viewboxHeight / imageHeight);
    }
    this.panZoom.center();

    var centeredX = this.panZoom.getPan().x;
    this.panZoom.pan({x: centeredX, y: 0});

  }

  ionViewDidEnter() {
    this.draw();
  }

  ionViewCanEnter(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.funcionId && this.planoConfiguracionId){
        this.getPlanoSegunFuncionPlanoConfiguracion(this.funcionId, this.planoConfiguracionId).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      } else {
        let ventaEnCurso = this.venta.getVentaEnCurso();
        if (ventaEnCurso.sector) {
          this.getPlano(ventaEnCurso.sector.id).then(() => {
            resolve();
          }).catch(() => {
            reject();
          })
        } else {
          reject();
        }
      }
    })
  }

  getPlano(id): Promise<any> {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.venta.getPlanoSector(id).then(response => {
        this.datosPlano = response;
        loading.dismissAll();
        resolve();
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
        reject(error);
      })
    })
  }

  /**
   * Función para mostrar el estado de ubicaciones en un plano al productor 
   * 
   * @param funcionId 
   * @param planoConfiguracionId 
   */
  getPlanoSegunFuncionPlanoConfiguracion(funcionId, planoConfiguracionId): Promise<any> {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.venta.getFuncionPlanoConfiguracion({funcionId, planoConfiguracionId}).then(response => {
        this.datosPlano = response.plano_sector_d_t_o;
        loading.dismissAll();
        resolve();
      }).catch(error => {
        loading.dismissAll();
        error.logLevel = 'error';
        this.error.handle(error);
        reject(error);
      })
    })
  }

  confirmarUbicaciones() {
    if(this.ubicacionesEnVenta.length) {
      this.viewCtrl.dismiss(this.ubicacionesEnVenta);
    } else {
      this.error.handle({text: 'Usted no ha seleccionado ubicaciones aún'});
    }
  }

  draw() {

    this.log("Datos recibidos del plano: ");
    this.log(this.datosPlano);
    if (this.datosPlano) {
      this.imagen = this.datosPlano.imagen_plano;
      this.ubicaciones = this.datosPlano.ubicaciones;
      this.secciones = this.datosPlano.sectores;

      this.setImage(this.getImagen());

      this.generarUbicaciones(this.getUbicaciones());

      this.drawTooltip();

      this.zoom();

    } else {
      alert('Hubo un problema con la carga del plano');
    }

  }

  drawTooltip() {
    var useToolTip = document.createElementNS(this.xmlns, "use");
    useToolTip.setAttributeNS(null, "id", "useToolTip");
    useToolTip.setAttributeNS(null, "class", "tooltip");
    useToolTip.setAttributeNS(this.xlinks, "xlink:href", "#tooltip");  // Este es el que se llamaba leyenda
    useToolTip.setAttributeNS(null, "visibility", "hidden");
    this.svgPlanoElement.nativeElement.appendChild(useToolTip);
  }

  getImagen() {
    return this.imagen;
  };

  setImage(imagen) {

    var o: ElementRef = this.imagenPlano;
    o.nativeElement.setAttributeNS(this.xlinks, "href", environment.apiConfig.backend.url + imagen.web_imagen + imagen.archivo_imagen);
    if (imagen.display_height != "") {
      this.figurePlanoElement.nativeElement.setAttribute('height', imagen.display_height);
      o.nativeElement.setAttribute("height", imagen.display_height);
    }
    if (imagen.display_width != "") {
      o.nativeElement.setAttribute("width", imagen.display_width);
    }

    var viewBox = this.svgPlanoElement;
    viewBox.nativeElement.setAttribute('viewBox', '0 0 ' + (parseInt(imagen.display_width) + 20) + ' ' + (parseInt(imagen.display_height) + 20));

    var height_property = 'height: ' + viewBox.nativeElement.clientHeight + 'px'
    document.getElementById('projectsvg').setAttribute('style', height_property);
  }

  getUbicaciones() {
    return this.ubicaciones;
  }

  generarUbicaciones(ubicaciones) {
    // Recorre las ubicaciones y si estan asociadas a un sector activo las agrega
    var ubicacionesNoGeneradas = [];
    var index = 0;
    this.log(ubicaciones);
    for (let ubicacion of ubicaciones) {
      this.addElement('ubicacion', ubicacion, index);
      index++;
    }

    if (ubicacionesNoGeneradas.length > 0) {
      this.log(ubicacionesNoGeneradas);
    }
  }

  addElement(name, ubicacion, index) {
    var use = document.createElementNS(this.xmlns, "use");
    use.setAttributeNS(null, "class", this.getClassStyle(ubicacion.estado));
    use.setAttributeNS(null, "x", ubicacion.x);
    use.setAttributeNS(null, "y", ubicacion.y);
    use.setAttributeNS(this.xlinks, "xlink:href", "#" + name);

    use.setAttributeNS(null, "id", "__ubic_" + ubicacion.id);

    // Indice del elemento que contiene los datos de la ubicacion
    use.setAttributeNS("ubicacion", "index", index);

    // Detalle de la ubicacion que se muestra por ejemplo como tooltip
    var detalleUbicacion = this.getDetalleUbicacion(ubicacion, '-')

    use.setAttributeNS("ubicacion", "detalle",
      detalleUbicacion['ubicacion'] +
      detalleUbicacion['seccion'] +
      detalleUbicacion['estado']);

    use.addEventListener("click",
      function (e) {
        var o = e.currentTarget;
        var ubicacion = this.getUbicacionFromSvg(o);

        this.marcarEnVenta(ubicacion);

      }.bind(this));

    // Evento para mostrar detalles de la ubicación
    use.addEventListener("mouseover", function (evt) {
      var o = evt.currentTarget;

      var useToolTip = document.getElementById("useToolTip");

      useToolTip.setAttributeNS(null, "x", ubicacion.x);
      useToolTip.setAttributeNS(null, "y", ubicacion.y);

      var detalleUbicacion = this.getDetalleUbicacion(ubicacion, '-');

      if (this.primerLineaDetalle.nativeElement.firstChild) {
        this.primerLineaDetalle.nativeElement.firstChild.data = detalleUbicacion.ubicacion;;
      }
      if (this.segundaLineaDetalle.nativeElement.firstChild) {
        this.segundaLineaDetalle.nativeElement.firstChild.data = detalleUbicacion.seccion + ' - ' + detalleUbicacion.estado;
      }

      var lenght1 = this.primerLineaDetalle.nativeElement.getComputedTextLength();
      var lenght2 = this.segundaLineaDetalle.nativeElement.getComputedTextLength();
      if (lenght2 > lenght1) {
        lenght1 = lenght2;
      }

      var tooltip_bg = document.getElementById("tooltip_bg");
      tooltip_bg.setAttributeNS(null, "width", String(lenght1 + 70));
      tooltip_bg.setAttributeNS(null, "height", String(50));

      useToolTip.setAttributeNS(null, "visibility", "visible");
    }.bind(this));

    use.addEventListener("mouseout",
      function (e) {
        // Ocultar tootltip
        var useToolTip = document.getElementById("useToolTip");
        useToolTip.setAttributeNS(null, "visibility", "hidden");
      }.bind(this));

    this.svgPlanoElement.nativeElement.appendChild(use);
  };

  
  //Funcion para obtener el total (precio + cargo) del diferencial en caso de que el sector lo tenga
  getDiferencial(sectorId) {
     if (this.sectorDiferenciales.length) {
       for (let i = 0 ; i < this.sectorDiferenciales.length ; i++) {
         if (this.sectorDiferenciales[i].funcion_sector_id == sectorId) {
           return parseFloat(this.sectorDiferenciales[i].precio) + parseFloat(this.sectorDiferenciales[i].cargo_servicio);
         }
       }
     }
     return -1;
  }
  
  getDetalleUbicacion(ubicacion, sep) {

    var sector = this.getSeccionUbicacion(ubicacion);
    sep = sep === undefined ? ' - ' : sep;

    var ret = [];
    if (sector) {
      if (ubicacion.nroOperacion==null) ret['ubicacion'] = sector.texto_fila + " " + ubicacion.fila + " " + sector.texto_ubicacion + " " + ubicacion.asiento;
       else ret['ubicacion'] = sector.texto_fila + " " + ubicacion.fila + " " + sector.texto_ubicacion + " " + ubicacion.asiento + " Operacion " + ubicacion.nroOperacion;
      ret['seccion'] = sector.detalle + " " + sep + " " + sector.precio.moneda + ( (this.getDiferencial(sector.id)==-1) ?sector.precio.importe :this.getDiferencial(sector.id));
      ret['estado'] = this.getDetalleEstado(ubicacion.estado); //  + " " + sep + "(" + ubicacion.id + ")";
    } else {
      ret['ubicacion'] = ubicacion.fila + " " + ubicacion.asiento;
      ret['seccion'] = 'test test';
      ret['estado'] = this.getDetalleEstado(ubicacion.estado); //  + " " + sep + "(" + ubicacion.id + ")";
    }

    return ret;
  };

  getSeccionUbicacion(ubicacion) {
    var seccion = null;
    if (this.secciones !== undefined) {
      var i = 0;
      while (this.secciones[i] && this.secciones[i].ubicaciones.indexOf(ubicacion.id) === -1) {
        i++;
      }
      seccion = this.secciones[i] ? this.secciones[i] : null;
    }
    return seccion;
  };

  getUbicacionFromSvg(svgElement) {
    var ubicacion = this.ubicaciones[parseInt(svgElement.getAttributeNS("ubicacion", "index"))];
    return ubicacion;
  };

  marcarEnVenta(ubicacion) {
    // Buscar la ubicacion en el vector de ubicaciones
    // Cambiar su estado previo verificar que este disponible
    // Cambiar su estilo en base al nuevo estado
    // Agregar la el objeto ubicacion al vector de ubicaciones en venta

    switch (ubicacion.estado) {
      case this.ESTADO_UBICACION_DISPONIBLE:
        if ((this.maxUbicacionesParaVenta === null) ||
          (this.ubicacionesEnVenta.length < this.maxUbicacionesParaVenta)) {
          ubicacion.estado = this.ESTADO_UBICACION_EN_VENTA;
          var sector = this.getSeccionUbicacion(ubicacion);
          ubicacion.texto_fila = sector.texto_fila;
          ubicacion.texto_ubicacion = sector.texto_ubicacion;
          this.ubicacionesEnVenta.push(ubicacion); //  [ubicacion.id + ""] = ubicacion;
        }
        break;
      case this.ESTADO_UBICACION_EN_VENTA:
        ubicacion.estado = this.ESTADO_UBICACION_DISPONIBLE;

        for (var i = this.ubicacionesEnVenta.length - 1; i >= 0; i--) {
          if (this.ubicacionesEnVenta[i].id === ubicacion.id) {
            this.ubicacionesEnVenta.splice(i, 1);
          }
        }
        break;
      default:
    }

    var o = this.getSvgUbicacion(ubicacion);

    // Actualizo clase
    o.setAttributeNS(null, "class", this.getClassStyle(ubicacion.estado));
    // Actualizo detalle
    var detalleUbicacion = this.getDetalleUbicacion(ubicacion, '-');
    o.setAttributeNS("ubicacion", "detalle",
      detalleUbicacion['ubicacion'] + detalleUbicacion['seccion'] + detalleUbicacion['estado']
    );

    this.actualizarListaDetalles();

    // LOG
    this.log(this.ubicacionesEnVenta);
  }

  getSvgUbicacion(ubicacion) {
    var svgUbicacion = document.getElementById("__ubic_" + ubicacion.id);
    return svgUbicacion;
  }

  getDetalleEstado(estado) {
    var detalle;

    switch (estado) {
      case this.ESTADO_UBICACION_DISPONIBLE:
        detalle = 'DISPONIBLE';
        break;

      case this.ESTADO_UBICACION_RESERVADA:
        detalle = 'RESERVADA';
        break;

      case this.ESTADO_UBICACION_VENDIDA:
        detalle = 'VENDIDA';
        break;

      case this.ESTADO_UBICACION_PREIMPRESA:
        detalle = 'PREIMPRESA';
        break;

      case this.ESTADO_UBICACION_BLOQUEADA:
        detalle = 'BLOQUEADA';
        break;

      case this.ESTADO_UBICACION_EN_VENTA:
        detalle = 'DISPONIBLE'; // Esta a propisito en DISPONIBLE para respetar modelo plano viejo
        break;

      case this.ESTADO_UBICACION_VENTA_EN_CURSO:
        detalle = 'NO DISPONIBLE';
        break;


      default:
        detalle = '';
    }

    return detalle;

  };

  getClassStyle(estado) {
    var _class = "";
    switch (estado) {
      case this.ESTADO_UBICACION_DISPONIBLE:
        _class = 'ubicacion_disponible';
        break;
      case this.ESTADO_UBICACION_RESERVADA:
        _class = 'ubicacion_reservada';
        break;
      case this.ESTADO_UBICACION_VENDIDA:
        _class = 'ubicacion_vendida';
        break;
      case this.ESTADO_UBICACION_PREIMPRESA:
        _class = 'ubicacion_preimpresa';
        break;
      case this.ESTADO_UBICACION_BLOQUEADA:
        _class = 'ubicacion_bloqueada';
        break;
      case this.ESTADO_UBICACION_EN_VENTA:
        _class = 'ubicacion_en_venta';
        break;

    }
    return _class;
  };

  /**
   * Dispara un evento mediante la propiedad seleccion
   * para que los componentes padres puedan realizar acciones
   * sobre las ubicaciones seleccionadas para venta
   */
  actualizarListaDetalles() {
    this.seleccion.emit({
      ubicacionesEnVenta: this.ubicacionesEnVenta,
    });
  }

  log(msg) {
    if (this.debug) {
      console.log(msg);
    }
  }

  //Agregado
 

}
