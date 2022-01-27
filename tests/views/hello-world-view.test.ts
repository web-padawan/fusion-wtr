import { expect } from '@esm-bundle/chai';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { TextFieldElement } from '@vaadin/vaadin-text-field';
import { ButtonElement } from '@vaadin/vaadin-button';
import { HelloWorldView } from '../../frontend/views/helloworld/hello-world-view';
import { showNotification } from '../mocks/mock-notification';
import '../../frontend/views/helloworld/hello-world-view';

describe('hello-world-view', () => {
  let view: HelloWorldView;
  let field: TextFieldElement;
  let button: ButtonElement;

  beforeEach(async () => {
    view = await fixture(html`<hello-world-view></hello-world-view>`);
    field = view.querySelector('vaadin-text-field')!;
    button = view.querySelector('vaadin-button')!;
  });

  describe('name', () => {
    const NAME = 'John Doe';

    it('should update name on text-field value change', () => {
      field.value = NAME;
      expect(view.name).to.equal(NAME);
    });

    it('should show notification with a name on button click', () => {
      field.value = NAME;
      button.click();
      expect(showNotification.calledOnce).to.be.true;
      expect(showNotification.firstCall.args[0]).to.contain(NAME);
    });
  });
});
