import { DireccionProvider } from './../../providers/direccion/direccion';
import { LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the SelectorLocalidadEspectaculoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'selector-localidad',
  templateUrl: 'selector-localidad.html'
})
export class SelectorLocalidadComponent {

  @Input('formGroup') localidadFormGroup: FormGroup;
  localidadForm: FormGroup;
  loadingPaises: boolean;
  paisesOptions: Array<any>;
  loadingProvincias: boolean;
  provinciasOptions: Array<any>;
  loadingLocalidades: boolean;
  localidadesOptions: Array<any>;
  argentinaId: number = 13;

  constructor(
    public direccionProvider: DireccionProvider,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder) {
      this.localidadFormGroup = this.formBuilder.group({
        pais: [null, Validators.required],
        provincia: [null, Validators.required],
        provincia_inexistente: [{value: null, disabled: true}, Validators.required],
        codPostal: [{value: null}],
        localidad: [null, Validators.required],
        localidad_inexistente: [{value: null, disabled: true}, Validators.required],
        localidad_inexistente_cod_postal: [{value: null, disabled: true}, Validators.required],
      });
      this.loadingPaises = false;
      this.paisesOptions = [];
      this.loadingProvincias = false;
      this.provinciasOptions = [];
      this.loadingLocalidades = false;
      this.localidadesOptions = [];
  }

  ngOnInit(){
    this.getPaises();
    this.getProvincias(this.argentinaId);
  }

  getPaises() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.loadingPaises = true;
    this.paisesOptions = [];
    this.direccionProvider.getPaises().then(response => {
      this.paisesOptions = response.paises;
      this.loadingPaises = false;
      this.localidadFormGroup.patchValue({pais: this.argentinaId});
      loader.dismiss();
    }).catch(() => {
      this.getPaises();
      loader.dismiss();
    })
  }

  getProvincias(id: number) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.loadingProvincias = true;
    this.provinciasOptions = [];
    this.direccionProvider.getProvincias(id).then(response => {
      this.provinciasOptions = response.provincias;
      this.loadingProvincias = false;
      loader.dismiss();
    }).catch(() => {
      this.getProvincias(id);
      loader.dismiss();
    })
  }

  getLocalidades(id: number) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.loadingLocalidades = true;
    this.localidadesOptions = [];
    this.direccionProvider.getLocalidades(id).then(response => {
      this.localidadesOptions = response.localidades;
      this.loadingLocalidades = false;
      loader.dismiss();
    }).catch(error => {
      this.getLocalidades(id);
      loader.dismiss();
    })
  }

  paisChanged(paisId) {
    this.localidadFormGroup.controls.provincia.reset();
    this.provinciaChanged(this.localidadFormGroup.value.provincia);
    this.getProvincias(paisId);
  }

  provinciaChanged(provinciaId) {
    this.localidadFormGroup.controls.provincia_inexistente.reset();
    this.localidadFormGroup.controls.localidad.reset();
    if (provinciaId === 0) {
      this.localidadesOptions = [];
      this.localidadFormGroup.controls.provincia_inexistente.enable();
      this.localidadFormGroup.patchValue({localidad: 0});
    } else {
      this.localidadFormGroup.controls.provincia_inexistente.disable();
      this.getLocalidades(provinciaId);
    }
    this.localidadChanged(this.localidadFormGroup.value.localidad);
  }

  localidadChanged(localidadId) {
    this.localidadFormGroup.controls.localidad_inexistente.reset();
    this.localidadFormGroup.controls.localidad_inexistente_cod_postal.reset();
    if (localidadId === 0) {
      this.localidadFormGroup.controls.localidad_inexistente.enable();
      this.localidadFormGroup.controls.localidad_inexistente_cod_postal.enable();
      this.localidadFormGroup.controls.localidad_inexistente_cod_postal.setValue(this.localidadFormGroup.controls.codPostal.value);
    } else {
      this.localidadFormGroup.controls.localidad_inexistente.disable();
      this.localidadFormGroup.controls.localidad_inexistente_cod_postal.disable();
    }
  }

}
