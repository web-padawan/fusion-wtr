import '@polymer/iron-icon';
import { EndpointError } from '@vaadin/flow-frontend';
import { showNotification } from '@vaadin/flow-frontend/a-notification';
import { Binder, field } from '@vaadin/form';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-date-time-picker';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-grid';
import { GridDataProviderCallback, GridDataProviderParams, GridElement } from '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-split-layout';
import '@vaadin/vaadin-template-renderer';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-upload';
import SamplePerson from 'Frontend/generated/com/example/application/data/entity/SamplePerson';
import SamplePersonModel from 'Frontend/generated/com/example/application/data/entity/SamplePersonModel';
import * as SamplePersonEndpoint from 'Frontend/generated/SamplePersonEndpoint';
import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { View } from '../view';

@customElement('master-detail-view')
export class MasterDetailView extends View {
  @query('#grid')
  private grid!: GridElement;

  @property({ type: Number })
  private gridSize = 0;

  private gridDataProvider = this.getGridData.bind(this);

  protected binder = new Binder<SamplePerson, SamplePersonModel>(this, SamplePersonModel);

  render() {
    return html`
      <vaadin-split-layout class="w-full h-full">
        <div class="flex-grow w-full">
          <vaadin-grid
            id="grid"
            class="w-full h-full"
            theme="no-border"
            .size=${this.gridSize}
            .dataProvider=${this.gridDataProvider}
            @active-item-changed=${this.itemSelected}
          >
            <vaadin-grid-sort-column auto-width path="firstName"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="lastName"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="email"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="phone"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="dateOfBirth"></vaadin-grid-sort-column
            ><vaadin-grid-sort-column auto-width path="occupation"></vaadin-grid-sort-column
            ><vaadin-grid-column auto-width path="important"
              ><template
                ><iron-icon
                  hidden="[[!item.important]]"
                  icon="vaadin:check"
                  style="width: var(--lumo-icon-size-s); height: var(--lumo-icon-size-s); color: var(--lumo-primary-text-color);"
                >
                </iron-icon>
                <iron-icon
                  hidden="[[item.important]]"
                  icon="vaadin:minus"
                  style="width: var(--lumo-icon-size-s); height: var(--lumo-icon-size-s); color: var(--lumo-disabled-text-color);"
                >
                </iron-icon></template
            ></vaadin-grid-column>
          </vaadin-grid>
        </div>
        <div class="flex flex-col" style="width: 400px;">
          <div class="p-l flex-grow">
            <vaadin-form-layout
              ><vaadin-text-field
                label="First name"
                id="firstName"
                ${field(this.binder.model.firstName)}
              ></vaadin-text-field
              ><vaadin-text-field
                label="Last name"
                id="lastName"
                ${field(this.binder.model.lastName)}
              ></vaadin-text-field
              ><vaadin-text-field label="Email" id="email" ${field(this.binder.model.email)}></vaadin-text-field
              ><vaadin-text-field label="Phone" id="phone" ${field(this.binder.model.phone)}></vaadin-text-field
              ><vaadin-date-picker
                label="Date of birth"
                id="dateOfBirth"
                ${field(this.binder.model.dateOfBirth)}
              ></vaadin-date-picker
              ><vaadin-text-field
                label="Occupation"
                id="occupation"
                ${field(this.binder.model.occupation)}
              ></vaadin-text-field
              ><vaadin-checkbox
                id="important"
                ${field(this.binder.model.important)}
                style="padding-top: var(--lumo-space-m);"
                >Important</vaadin-checkbox
              ></vaadin-form-layout
            >
          </div>
          <vaadin-horizontal-layout class="w-full flex-wrap bg-contrast-5 py-s px-l" theme="spacing">
            <vaadin-button theme="primary" @click=${this.save}>Save</vaadin-button>
            <vaadin-button theme="tertiary" @click=${this.cancel}>Cancel</vaadin-button>
          </vaadin-horizontal-layout>
        </div>
      </vaadin-split-layout>
    `;
  }

  private async getGridData(
    params: GridDataProviderParams<SamplePerson>,
    callback: GridDataProviderCallback<SamplePerson | undefined>
  ) {
    const index = params.page * params.pageSize;
    const data = await SamplePersonEndpoint.list(index, params.pageSize, params.sortOrders as any);
    callback(data ?? []);
  }

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'h-full');
    this.gridSize = (await SamplePersonEndpoint.count()) ?? 0;
  }

  private async itemSelected(event: CustomEvent) {
    const item: SamplePerson = event.detail.value as SamplePerson;
    this.grid.selectedItems = item ? [item] : [];

    if (item) {
      const fromBackend = await SamplePersonEndpoint.get(item.id!);
      fromBackend ? this.binder.read(fromBackend) : this.refreshGrid();
    } else {
      this.clearForm();
    }
  }

  async save() {
    try {
      const isNew = !this.binder.value.id;
      await this.binder.submitTo(SamplePersonEndpoint.update);
      if (isNew) {
        // We added a new item
        this.gridSize++;
      }
      this.clearForm();
      this.refreshGrid();
      showNotification(`SamplePerson details stored.`, { position: 'bottom-start' });
    } catch (error) {
      if (error instanceof EndpointError) {
        showNotification(`Server error. ${error.message}`, { position: 'bottom-start' });
      } else {
        throw error;
      }
    }
  }

  private cancel() {
    this.grid.activeItem = undefined;
  }

  private clearForm() {
    this.binder.clear();
  }

  private refreshGrid() {
    this.grid.selectedItems = [];
    this.grid.clearCache();
  }
}
