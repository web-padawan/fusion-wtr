import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TextFieldElement } from '@vaadin/vaadin-text-field';
import { EmailFieldElement } from '@vaadin/vaadin-text-field/vaadin-email-field';
import { DatePickerElement } from '@vaadin/vaadin-date-picker';
import { CustomFieldElement } from '@vaadin/vaadin-custom-field';
import { ButtonElement } from '@vaadin/vaadin-button';
import { PersonFormViewElement } from '../../frontend/views/personform/person-form-view';
import { EndpointError } from '@vaadin/flow-frontend';
import { showNotification } from '../mocks/mock-notification';
import { setValue } from '../helpers/setValue';
import '../../frontend/views/personform/person-form-view';

@customElement('test-person-form')
class TestPersonForm extends PersonFormViewElement {
  mockSubmit = sinon.stub(this.binder, 'submitTo');
  spyClear = sinon.spy(this.binder, 'clear');
  spySave = sinon.spy(this, 'save');
}

describe('person-form-view', () => {
  let view: TestPersonForm;
  let buttons: Array<ButtonElement>;
  let firstName: TextFieldElement;
  let lastName: TextFieldElement;
  let birthDay: DatePickerElement;
  let phone: CustomFieldElement;
  let email: EmailFieldElement;
  let occupation: TextFieldElement;

  beforeEach(async () => {
    view = await fixture(html`<test-person-form></test-person-form>`);
    buttons = Array.from(view.querySelectorAll('vaadin-button'));
    firstName = view.querySelector('[label="First name"]');
    lastName = view.querySelector('[label="Last name"]');
    birthDay = view.querySelector('[label="Birthday"]');
    phone = view.querySelector('[label="Phone number"]');
    email = view.querySelector('[label="Email address"]');
    occupation = view.querySelector('[label="Occupation"]');
  });

  describe('save', () => {
    beforeEach(async () => {
      // Fill in all the fields
      setValue(firstName, 'John');
      setValue(lastName, 'Doe');
      setValue(birthDay, '1990-01-28');
      setValue(phone, '+354\t94\t7891234');
      setValue(email, 'john.doe@gmail.com');
      setValue(occupation, 'scientist');
      await view.updateComplete;
    });

    describe('success', () => {
      afterEach(() => {
        showNotification.resetHistory();
      })

      it('should submit the binder on Save button click', async () => {
        buttons[0].click();
        await view.updateComplete;
        expect(view.mockSubmit.calledOnce).to.be.true;
      });

      it('should clear the binder on Save button click', async () => {
        buttons[0].click();
        await view.updateComplete;
        expect(view.spyClear.calledOnce).to.be.true;
      });

      it('should show notification on binder submit success', async () => {
        buttons[0].click();
        await view.updateComplete;
        expect(showNotification.calledOnce).to.be.true;
        expect(showNotification.firstCall.args[0]).to.contain('SamplePerson details stored.');
      });
    });

    describe('error', () => {
      const ERROR = 'No space left';

      beforeEach(() => {
        view.mockSubmit.rejects(new EndpointError(ERROR));
      });

      afterEach(() => {
        showNotification.resetHistory();
      });

      it('should not clear the binder on endpoint error', async () => {
        buttons[0].click();
        await view.spySave.firstCall;
        expect(view.spyClear.calledOnce).to.be.false;
      });

      it('should show notification on endpoint error', async () => {
        buttons[0].click();
        await view.spySave.firstCall;
        expect(showNotification.calledOnce).to.be.true;
        expect(showNotification.firstCall.args[0]).to.contain(ERROR);
      });
    });
  });

  describe('clear', () => {
    beforeEach(async () => {
      // Fill in all the fields
      setValue(firstName, 'John');
      setValue(lastName, 'Doe');
      setValue(birthDay, '1990-01-28');
      setValue(phone, '+354\t94\t7891234');
      setValue(email, 'john.doe@gmail.com');
      setValue(occupation, 'scientist');
      await view.updateComplete;
    });

    it('should clear the binder on Clear button click', async () => {
      buttons[1].click();
      await view.updateComplete;
      expect(view.spyClear.calledOnce).to.be.true;
    });

    it('should clear the fields on Clear button click', async () => {
      buttons[1].click();
      await view.updateComplete;
      expect(firstName.value).to.be.equal('');
      expect(lastName.value).to.be.equal('');
      expect(birthDay.value).to.be.equal('');
      expect(phone.value).to.be.equal('');
      expect(email.value).to.be.equal('');
      expect(occupation.value).to.be.equal('');
    });
  });
});
