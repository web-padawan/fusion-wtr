import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GridElement } from '@vaadin/vaadin-grid';
import { TextFieldElement } from '@vaadin/vaadin-text-field';
import { DatePickerElement } from '@vaadin/vaadin-date-picker';
import { ButtonElement } from '@vaadin/vaadin-button';
import { MasterDetailView } from '../../frontend/views/masterdetail/master-detail-view';
import { EndpointError } from '@vaadin/flow-frontend';
import { showNotification } from '../mocks/mock-notification';
import { getBodyCellContent } from '../helpers/grid';
import { setValue } from '../helpers/setValue';
import '../helpers/promise';
import SamplePerson from '../../frontend/generated/com/example/application/data/entity/SamplePerson';
import { get, list } from '../mocks/endpoints/SamplePersonEndpoint';
import '../../frontend/views/masterdetail/master-detail-view';

@customElement('test-master-detail')
class TestMasterDetail extends MasterDetailView {
  mockSubmit = sinon.stub(this.binder, 'submitTo');
  spyClear = sinon.spy(this.binder, 'clear');
  spySave = sinon.spy(this, 'save');

}

describe('master-detail-view', () => {
  let view: TestMasterDetail;
  let grid: GridElement;
  let items: SamplePerson[];

  let firstName: TextFieldElement;
  let lastName: TextFieldElement;
  let email: TextFieldElement;
  let phone: TextFieldElement;
  let dateOfBirth: DatePickerElement;
  let occupation: TextFieldElement;

  before(async () => {
    items = await list();
    list.resetHistory();
  });

  beforeEach(async () => {
    view = await fixture(html`<test-master-detail></test-master-detail>`);
    grid = view.querySelector('vaadin-grid');
    firstName = view.querySelector('#firstName');
    lastName = view.querySelector('#lastName');
    email = view.querySelector('#email');
    phone = view.querySelector('#phone');
    dateOfBirth = view.querySelector('#dateOfBirth');
    occupation = view.querySelector('#occupation');
  });

  describe('select an item', () => {
    it('should update the form when grid item is selected', async () => {
      const cell = getBodyCellContent(grid, 0, 0);
      cell.click();
      await get.firstCall;
      await view.updateComplete;
      expect(firstName.value).to.equal(items[0].firstName);
      expect(lastName.value).to.equal(items[0].lastName);
      expect(email.value).to.equal(items[0].email);
      expect(phone.value).to.equal(items[0].phone);
      expect(dateOfBirth.value).to.equal(items[0].dateOfBirth);
      expect(occupation.value).to.equal(items[0].occupation);
    });

    it('should update the form when selected item is updated', async () => {
      const cell = getBodyCellContent(grid, 0, 0);
      cell.click();
      await get.firstCall;
      await view.updateComplete;

      const cell2 = getBodyCellContent(grid, 1, 0);
      cell2.click();
      await get.secondCall;
      await view.updateComplete;

      expect(firstName.value).to.equal(items[1].firstName);
      expect(lastName.value).to.equal(items[1].lastName);
      expect(email.value).to.equal(items[1].email);
      expect(phone.value).to.equal(items[1].phone);
      expect(dateOfBirth.value).to.equal(items[1].dateOfBirth);
      expect(occupation.value).to.equal(items[1].occupation);
    });

    it('should clear the form when grid item is unselected', async () => {
      const cell = getBodyCellContent(grid, 0, 0);
      cell.click();
      await get.firstCall;
      await view.updateComplete;

      cell.click();
      await view.updateComplete;

      expect(firstName.value).to.equal('');
      expect(lastName.value).to.equal('');
      expect(email.value).to.equal('');
      expect(phone.value).to.equal('');
      expect(dateOfBirth.value).to.equal('');
      expect(occupation.value).to.equal('');
    });
  });

  describe('updating an item', () => {
    let buttons: ButtonElement[];

    beforeEach(async () => {
      view.spyClear.resetHistory();
      const cell = getBodyCellContent(grid, 0, 0);
      cell.click();
      await get.firstCall;
      await view.updateComplete;
      buttons = Array.from(view.querySelectorAll('vaadin-button'));
    });

    describe('success', () => {
      beforeEach(async () => {
        setValue(email, 'eula@gmail.com');
        await view.updateComplete;
      })

      afterEach(() => {
        showNotification.resetHistory();
      })

      it('should submit the binder on Save button click', async () => {
        buttons[0].click();
        await view.updateComplete;
        expect(view.mockSubmit.calledOnce).to.be.true;
      })

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

      it('should clear the grid cache on Save button click', async () => {
        const spyClearCache = sinon.spy(grid, 'clearCache');
        buttons[0].click();
        await view.updateComplete;
        expect(spyClearCache.calledOnce).to.be.true;
      });
    });

    describe('endpoint error', () => {
      const ERROR = 'No space left';

      beforeEach(async () => {

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

    describe('unknown error', () => {
      const ERROR = 'Server Unavailable';

      beforeEach(() => {
        view.mockSubmit.rejects(new Error(ERROR));
      });

      it('should throw an exception on unknown error', () => {
        expect(view.save()).to.eventually.be.rejectedWith(Error);
      });
    });
  });
});
