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
import { EndpointError } from '@vaadin/flow-frontend';
import { setValue } from '../helpers/events';
import '../../frontend/views/addressform/address-form-view';

@customElement('test-address-form')
class TestAddressForm extends AddressFormView {
  clearSpy = sinon.spy(this.binder, 'clear');
  submitStub = sinon.stub(this.binder, 'submitTo');
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
    beforeEach(async () => {
      // Fill in all the fields
      setValue(address, '1234 Main Street');
      setValue(code, '02000');
      setValue(city, 'City 1');
      setValue(city, 'State 1');
      setValue(country, 'Country 1');
      await view.updateComplete;
    });

    it('should submit the binder on Save button click', async () => {
      buttons[0].click();
      await view.updateComplete;
      expect(view.submitStub.calledOnce).to.be.true;
    });

    it('should clear the binder on Save button click', async () => {
      buttons[0].click();
      await view.updateComplete;
      expect(view.clearSpy.calledOnce).to.be.true;
    });

    it('should not clear the binder on endpoint error', async () => {
      view.submitStub.rejects(new EndpointError('No space left'));
      try {
        buttons[0].click();
        await view.submitStub.returnValues[0];
      } catch (e) {
        // do nothing
      }
      expect(view.clearSpy.calledOnce).to.be.false;
    });
  });

  describe('clear', () => {
    beforeEach(async () => {
      // Fill in all the fields
      setValue(address, '1234 Main Street');
      setValue(code, '02000');
      setValue(city, 'City 1');
      setValue(city, 'State 1');
      setValue(country, 'Country 1');
      await view.updateComplete;
    });

    it('should clear the binder on Clear button click', () => {
      buttons[1].click();
      expect(view.clearSpy.calledOnce).to.be.true;
    });

    it('should clear the fields on Clear button click', async () => {
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
