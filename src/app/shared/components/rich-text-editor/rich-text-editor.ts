import {Component, forwardRef, Input} from "@angular/core";
import {ModalController} from "ionic-angular";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * Generated class for the ErrorDisplayComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rich-text-editor',
  templateUrl: 'rich-text-editor.html',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef( () => RichTextEditorComponent), multi: true}
  ]
})
export class RichTextEditorComponent implements ControlValueAccessor{

  @Input() label: string = null;
  public texto: string;

  constructor(public modalCtrl: ModalController) {
  }

  private onChange: Function = (texto) => {this.texto = texto};
  private onTouch: Function = () => {};
  private disabled: boolean = false;


  writeValue(value: any): void {
    this.onChange(value);
    this.texto = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  editarTexto = () => {
    let modalFuncion = this.modalCtrl.create('EditorTextoPage',
      {texto: this.texto},
      {enableBackdropDismiss: false, cssClass: "modal-inicial"});
    modalFuncion.present();
    modalFuncion.onDidDismiss(data => {
      this.texto = data;
      this.onChange(data);
    });
  }
}
