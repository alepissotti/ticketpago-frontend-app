import { ReporteProvider } from './../providers/reporte/reporte';
import { SearchableTipoEnvioProvider } from './../providers/searchable-tipo-envio/searchable-tipo-envio';
import { TurnoProvider } from './../providers/turno/turno';
import { SearchablePuntoVentaProvider } from './../providers/searchable-punto-venta/searchable-punto-venta';
import { SearchableOperacionProvider } from './../providers/searchable-operacion/searchable-operacion';
import { SearchableFuncionProvider } from './../providers/searchable-funcion/searchable-funcion';
import { SearchableEspectaculoProvider } from './../providers/searchable-espectaculo/searchable-espectaculo';
import { SharedModule } from './shared/shared.module';
import { SearchableLoteOperacionEnvioEstadoProvider } from '../providers/searchable-lote-operacion-envio-estado/searchable-lote-operacion-envio-estado';
import { TimerProvider } from './../components/resumen-venta/provider/timer';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, Injector, LOCALE_ID, NgModule} from '@angular/core';
import es from '@angular/common/locales/es';
import {IonicApp, IonicErrorHandler, IonicModule, LoadingController} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpInterceptorModule} from "ng-http-interceptor";
import {ApiProvider, ErrorProvider, PrinterProvider, UsuarioProvider, VentaProvider, DireccionProvider} from '../providers/providers';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ComponentsModule} from "../components/components.module";
import {CarteleraProvider} from "../providers/cartelera/cartelera";
import {NgCircleProgressModule} from "ng-circle-progress";
import {LoginPageModule} from "../pages/login/login.module";
import {TicketPagoModule} from '../pages/ticket-pago/ticket-pago.module';
import {MediosTicketPagoModule} from '../pages/medios-ticket-pago/medios-ticket-pago.module';
import {EcommerceModule} from '../pages/e-commerce/e-commerce.module';
import {ComprobantesEcommerceModule} from '../pages/comprobantes-ecommerce/comprobantes-ecommerce.module';
import {ReimpresionComprobantesModule} from '../pages/reimpresion-comprobantes/reimpresion-comprobantes.module';
import {TransaccionTicketPagoModule} from '../pages/transaccion-ticketpago/transaccion-ticketpago.module';
import {ModalLinkPagoModule} from '../pages/modal-link-pago/modal-link-pago.module';
import {LinkPagoModule} from '../pages/link-pago/link-pago.module';
import {LinkTicketPagoModule} from '../pages/link-ticket-pago/link-ticket-pago.module';
import {MediosLinkPagoModule} from '../pages/medios-link-pago/medios-link-pago.module';
import {DevolucionesLineModule} from '../pages/devoluciones-line/devoluciones-line.module';
import {ModalDevolucionesModule} from '../pages/modal-devoluciones/modal-devoluciones.module';
import {ModalFirmaDigitalModule} from '../pages/modal-firma-digital/modal-firma-digital.module';
import {ConsultaOperacionesPageModule} from '../pages/consulta-operaciones/consulta-operaciones.module';
import {ListadoConsultaOperacionesPageModule} from '../pages/listado-consulta-operaciones/listado-consulta-operaciones.module';
import {VentaPageModule} from "../pages/venta/venta.module";
import { CajaProvider } from '../providers/caja/caja';
import { PuntoVentaProvider } from '../providers/punto-venta/punto-venta';
import {LineProvider} from '../providers/line/line';
import { MensajeProvider } from '../providers/mensaje/mensaje';
import { registerLocaleData } from '@angular/common';
import { AuthInterceptorProvider } from '../providers/auth-interceptor/auth-interceptor';
import { SignaturePadModule } from 'angular2-signaturepad';

registerLocaleData(es);

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpInterceptorModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    }),
    NgCircleProgressModule.forRoot({
      radius: 21,
      outerStrokeWidth: 4,
      outerStrokeColor: "#f53d3d",
      animationDuration: 300,
      percent: 0,
      showUnits: false,
      showSubtitle: false,
      showBackground: false,
      innerStrokeColor: "#C7E596",
      innerStrokeWidth: 4,
      space: -4
    }),
    ComponentsModule,
    LoginPageModule,
    SharedModule,
    VentaPageModule,
    TicketPagoModule,
    MediosTicketPagoModule,
    EcommerceModule,
    ComprobantesEcommerceModule,
    TransaccionTicketPagoModule,
    ReimpresionComprobantesModule,
    ModalLinkPagoModule,
    LinkPagoModule,
    LinkTicketPagoModule,
    MediosLinkPagoModule,
    DevolucionesLineModule,
    ModalDevolucionesModule,
    ModalFirmaDigitalModule,
    ConsultaOperacionesPageModule,
    ListadoConsultaOperacionesPageModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: "es"},
    ApiProvider,
    CarteleraProvider,
    DireccionProvider,
    UsuarioProvider,
    VentaProvider,
    PrinterProvider,
    ErrorProvider,
    LoadingController,
    CajaProvider,
    PuntoVentaProvider,
    ReporteProvider,
    MensajeProvider,
    SearchableEspectaculoProvider,
    SearchableFuncionProvider,
    SearchableLoteOperacionEnvioEstadoProvider,
    SearchableOperacionProvider,
    SearchablePuntoVentaProvider,
    SearchableTipoEnvioProvider,
    TimerProvider,
    TurnoProvider,
    LineProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorProvider,
      multi: true
    }
  ],
})
export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) { AppModule.injector = injector; }
}
