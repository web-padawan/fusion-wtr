import { TextFieldElement } from '@vaadin/vaadin-text-field';
import { ComboBoxElement } from '@vaadin/vaadin-combo-box';

export const setValue = (field: TextFieldElement | ComboBoxElement, value: string) => {
  field.value = value;
  field.dispatchEvent(new Event('change'));
}
