import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormControl} from "@angular/forms";

/**
 * Generated class for the SearchableEntityCriteriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'editor-texto',
  templateUrl: 'editor-texto.html',
})
export class EditorTextoPage {

  public texto: any;
  public textoOriginal: any;

  public formControlTexto: FormControl;

  constructor(private formBuilder: FormBuilder,
              public navParams: NavParams,
              protected viewCtrl: ViewController) {
    this.texto = this.navParams.get('texto');
    this.textoOriginal = JSON.parse(JSON.stringify( this.texto ));

    this.formControlTexto = formBuilder.control(this.texto);
  }

  cancelar() {
    this.formControlTexto.setValue(JSON.parse(JSON.stringify(this.textoOriginal)));
    this.cerrar();
  }

  cerrar() {
    this.viewCtrl.dismiss(this.formControlTexto.value);
  }
}
