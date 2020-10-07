import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MenuVentaPage} from './menu-venta';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    MenuVentaPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuVentaPage),
    ComponentsModule
  ],
})
export class MenuVentaPageModule {
}
