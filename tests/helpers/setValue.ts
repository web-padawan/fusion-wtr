import { TextFieldElement } from '@vaadin/vaadin-text-field';
import { ComboBoxElement } from '@vaadin/vaadin-combo-box';
import { DatePickerElement } from '@vaadin/vaadin-date-picker';
import { CustomFieldElement } from '@vaadin/vaadin-custom-field';

export const setValue = (
  field: TextFieldElement | ComboBoxElement | CustomFieldElement | DatePickerElement,
  value: string
) => {
  field.value = value;
  field.dispatchEvent(new Event('change'));
};
