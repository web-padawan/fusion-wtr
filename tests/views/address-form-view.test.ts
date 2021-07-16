import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TextFieldElement } from '@vaadin/vaadin-text-field';
import { NumberFieldElement } from '@vaadin/vaadin-text-field/vaadin-number-field';
import { ComboBoxElement } from '@vaadin/vaadin-combo-box';
import { ButtonElement } from '@vaadin/vaadin-button';
import { AddressFormView } from '../../frontend/views/addressform/address-form-view';
import '../../frontend/views/addressform/address-form-view';

@customElement('test-address-form')
class TestAddressForm extends AddressFormView {
  clearSpy = sinon.spy(this.binder, 'clear');
  submitSpy = sinon.spy(this.binder, 'submitTo');
}

describe('address-form-view', () => {
  let view: TestAddressForm;
  let buttons: Array<ButtonElement>;
  let address: TextFieldElement;
  let code: NumberFieldElement;
  let city: TextFieldElement;
  let state: ComboBoxElement;
  let country: ComboBoxElement;

  beforeEach(async () => {
    view = await fixture(html`<test-address-form></test-address-form>`);
    buttons = Array.from(view.querySelectorAll('vaadin-button'));
    address = view.querySelector('[label="Street address"]');
    code = view.querySelector('[label="Postal code"]');
    city = view.querySelector('[label="City"]');
    state = view.querySelector('#state');
    country = view.querySelector('#country');
  });

  describe('save', () => {
    beforeEach(() => {
      address.value = '1234 Main Street';
      code.value = '02000';
      city.value = 'City 1';
      state.value = 'State 1';
      country.value = 'Country 1';
    });

    it('should submit the binder on Save button click', async () => {
      buttons[0].click();
      await view.submitSpy.returnValues[0];
      expect(view.submitSpy.calledOnce).to.be.true;
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      address.value = '1234 Main Street';
      code.value = '02000';
      city.value = 'City 1';
      state.value = 'State 1';
      country.value = 'Country 1';
    });

    it('should clear the binder on Clear button click', () => {
      buttons[1].click();
      expect(view.clearSpy.calledOnce).to.be.true;
    });

    // FIXME: the clear method does not clear the fields
    it.skip('should clear the fields on Clear button click', async () => {
      buttons[1].click();
      await view.updateComplete;
      expect(address.value).to.be.equal('');
      expect(code.value).to.be.equal('');
      expect(city.value).to.be.equal('');
      expect(state.value).to.be.equal('');
      expect(country.value).to.be.equal('');
    });
  });
});
