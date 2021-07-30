import { EndpointError } from '@vaadin/flow-frontend';
import { showNotification } from '@vaadin/flow-frontend/a-notification';
import { Binder, field } from '@vaadin/form';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-combo-box';
import type { ComboBoxElement } from '@vaadin/vaadin-combo-box/vaadin-combo-box';
import '@vaadin/vaadin-custom-field';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-item';
import '@vaadin/vaadin-notification';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-email-field';
import '@vaadin/vaadin-text-field/vaadin-number-field';
import SamplePersonModel from 'Frontend/generated/com/example/application/data/entity/SamplePersonModel';
import * as SamplePersonEndpoint from 'Frontend/generated/SamplePersonEndpoint';
import { html, PropertyValues } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { View } from '../view';

@customElement('person-form-view')
export class PersonFormViewElement extends View {
  @query('#countryCode')
  private countryCode!: ComboBoxElement | null;

  protected binder = new Binder(this, SamplePersonModel);

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.countryCode!.items = ['+354', '+91', '+62', '+98', '+964', '+353', '+44', '+972', '+39', '+225'];
  }

  render() {
    return html`
      <h3>Personal information</h3>
      <vaadin-form-layout style="width: 100%;">
        <vaadin-text-field label="First name" ${field(this.binder.model.firstName)}></vaadin-text-field>
        <vaadin-text-field label="Last name" ${field(this.binder.model.lastName)}></vaadin-text-field>
        <vaadin-date-picker label="Birthday" ${field(this.binder.model.dateOfBirth)}></vaadin-date-picker>
        <vaadin-custom-field label="Phone number" ${field(this.binder.model.phone)}>
          <vaadin-horizontal-layout theme="spacing">
            <vaadin-combo-box
              id="countryCode"
              style="width: 120px;"
              pattern="\\+\\d*"
              placeholder="Country"
              prevent-invalid-input
            ></vaadin-combo-box>
            <vaadin-text-field
              style="width: 120px; flex-grow: 1;"
              pattern="\\d*"
              prevent-invalid-input
            ></vaadin-text-field>
          </vaadin-horizontal-layout>
        </vaadin-custom-field>
        <vaadin-email-field label="Email address" ${field(this.binder.model.email)}"></vaadin-email-field>
        <vaadin-text-field label="Occupation" ${field(this.binder.model.occupation)}"></vaadin-text-field>
      </vaadin-form-layout>
      <vaadin-horizontal-layout class="button-layout" theme="spacing">
        <vaadin-button theme="primary" @click="${this.save}"> Save </vaadin-button>
        <vaadin-button @click="${this.clearForm}"> Cancel </vaadin-button>
      </vaadin-horizontal-layout>
    `;
  }

  async save() {
    try {
      await this.binder.submitTo(SamplePersonEndpoint.update);
      this.clearForm();
      showNotification('SamplePerson details stored.', { position: 'bottom-start' });
    } catch (error) {
      if (error instanceof EndpointError) {
        showNotification('Server error. ' + error.message, { position: 'bottom-start' });
      } else {
        throw error;
      }
    }
  }

  private clearForm() {
    this.binder.clear();
  }
}
