import {Component, Input} from "@angular/core";

/**
 * Generated class for the ErrorDisplayComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'error-display',
  templateUrl: 'error-display.html',
  inputs: ['formGroupElement', 'fieldName']
})
export class ErrorDisplayComponent{

  @Input('validation') validation;

  constructor() {
  }
}
