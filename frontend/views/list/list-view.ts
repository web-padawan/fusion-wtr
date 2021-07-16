import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-grid-pro';
import '@vaadin/vaadin-grid-pro/vaadin-grid-pro-edit-column';
import '@vaadin/vaadin-grid/all-imports';
import type { GridElement } from '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-lumo-styles/all-imports';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-number-field';
// import the remote endpoint
import * as viewEndpoint from 'Frontend/generated/ListEndpoint';
import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { View } from '../view';

@customElement('list-view')
export class ListView extends View {
  @query('#grid') private grid!: GridElement | null;

  @property()
  statusOptions: string[] = ['Pending', 'Success', 'Error'];

  currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  dateFormatter = new Intl.DateTimeFormat('en-US');

  protected _boundRenderAmount = this.renderAmount.bind(this);

  protected _boundRenderDate = this.renderDate.bind(this);

  render() {
    return html`
      <vaadin-grid-pro id="grid" theme="no-border column-borders">
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>

        <vaadin-grid-column-group id="id-column-group" .headerRenderer="${this.renderIdGroupHeader}">
          <vaadin-grid-column
            id="id-column"
            path="id"
            flex-grow="0"
            width="120px"
            .headerRenderer="${this.renderIdHeader}"
          >
          </vaadin-grid-column>
        </vaadin-grid-column-group>

        <vaadin-grid-column-group id="client-column-group" .headerRenderer="${this.renderClientGroupHeader}">
          <vaadin-grid-column
            id="client-column"
            path="client"
            .headerRenderer="${this.renderClientHeader}"
            .renderer="${this.renderClient}"
          >
          </vaadin-grid-column>
        </vaadin-grid-column-group>

        <vaadin-grid-column-group id="amount-column-group" .headerRenderer="${this.renderAmountGroupHeader}">
          <vaadin-grid-pro-edit-column
            id="amount-column"
            path="amount"
            .headerRenderer=${this.renderAmountHeader}
            .renderer="${this._boundRenderAmount}"
          >
          </vaadin-grid-pro-edit-column>
        </vaadin-grid-column-group>

        <vaadin-grid-column-group id="status-column-group" .headerRenderer="${this.renderStatusGroupHeader}">
          <vaadin-grid-pro-edit-column
            id="status-column"
            path="status"
            editor-type="select"
            .editorOptions="${this.statusOptions}"
            .headerRenderer=${this.renderStatusHeader}
            .renderer=${this.renderStatus}
          >
          </vaadin-grid-pro-edit-column>
        </vaadin-grid-column-group>

        <vaadin-grid-column-group id="date-column-group" .headerRenderer="${this.renderDateGroupHeader}">
          <vaadin-grid-column
            id="date-column"
            path="date"
            flex-grow="0"
            width="180px"
            .headerRenderer=${this.renderDateHeader}
            .renderer=${this._boundRenderDate}
          >
          </vaadin-grid-column>
        </vaadin-grid-column-group>
      </vaadin-grid-pro>
    `;
  }

  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);

    // Retrieve data from the server-side endpoint.
    this.grid!.items = (await viewEndpoint.clients()) ?? [];
  }

  renderIdGroupHeader(root: HTMLElement) {
    root.innerHTML = '<vaadin-grid-sorter path="id">ID</vaadin-grid-sorter>';
  }

  renderIdHeader(root: HTMLElement) {
    root.innerHTML = `
        <vaadin-grid-filter path="id">
          <vaadin-number-field
            clear-button-visible
            placeholder="Filter"
            slot="filter"
          ></vaadin-number-field>
        </vaadin-grid-filter>
      `;

    const filter: any = root.querySelector('vaadin-grid-filter');
    root.querySelector('vaadin-number-field')!.addEventListener('value-changed', (e: any) => {
      filter.value = e.detail.value;
    });
  }

  renderClientGroupHeader(root: HTMLElement) {
    root.innerHTML = '<vaadin-grid-sorter path="client">Client</vaadin-grid-sorter>';
  }

  renderClientHeader(root: HTMLElement) {
    root.innerHTML = `
        <vaadin-grid-filter path="client">
          <vaadin-text-field
            clear-button-visible
            placeholder="Filter"
            slot="filter"
          ></vaadin-text-field>
        </vaadin-grid-filter>
      `;
    const filter: any = root.querySelector('vaadin-grid-filter');
    root.querySelector('vaadin-text-field')!.addEventListener('value-changed', (e: any) => {
      filter.value = e.detail.value;
    });
  }

  renderClient(root: HTMLElement, _column: any, rowData: any) {
    root.innerHTML = `
        <vaadin-horizontal-layout theme="spacing">
          <img src="${rowData.item.img}" />
          <span class="name">${rowData.item.client}</span>
        </vaadin-horizontal-layout>
      `;
  }

  renderAmountGroupHeader(root: HTMLElement) {
    root.innerHTML = '<vaadin-grid-sorter path="amount">Amount</vaadin-grid-sorter>';
  }

  renderAmountHeader(root: HTMLElement) {
    root.innerHTML = `
        <vaadin-grid-filter path="amount">
          <vaadin-text-field
            clear-button-visible
            placeholder="Filter"
            slot="filter"
          ></vaadin-text-field>
        </vaadin-grid-filter>
      `;
    const filter: any = root.querySelector('vaadin-grid-filter');
    root.querySelector('vaadin-text-field')!.addEventListener('value-changed', (e: any) => {
      filter.value = e.detail.value;
    });
  }

  renderAmount(root: HTMLElement, _column: any, rowData: any) {
    root.innerHTML = `<span>${this.currencyFormatter.format(rowData.item.amount)}</span>`;
  }

  renderStatusGroupHeader(root: HTMLElement) {
    root.innerHTML = '<vaadin-grid-sorter path="status">Status</vaadin-grid-sorter>';
  }

  renderStatusHeader(root: HTMLElement) {
    root.innerHTML = `
        <vaadin-grid-filter path="status">
          <vaadin-combo-box
            clear-button-visible
            placeholder="Filter"
            slot="filter"
            .items="${this.statusOptions}"
          ></vaadin-combo-box>
        </vaadin-grid-filter>
      `;
    const filter: any = root.querySelector('vaadin-grid-filter');
    const comboBox: any = root.querySelector('vaadin-combo-box');
    comboBox.items = ['Pending', 'Success', 'Error'];
    comboBox.addEventListener('value-changed', (e: any) => {
      filter.value = e.detail.value;
    });
  }

  renderStatus(root: HTMLElement, _column: any, rowData: any) {
    root.innerHTML = ` <span theme="badge ${rowData.item.status.toLowerCase()}"> ${rowData.item.status} </span>`;
  }

  renderDateGroupHeader(root: HTMLElement) {
    root.innerHTML = '<vaadin-grid-sorter path="date">Date</vaadin-grid-sorter>';
  }

  renderDateHeader(root: HTMLElement) {
    root.innerHTML = `
        <vaadin-grid-filter path="date">
          <vaadin-date-picker
            clear-button-visible
            placeholder="Filter"
            slot="filter"
          ></vaadin-date-picker>
        </vaadin-grid-filter>
      `;
    const filter: any = root.querySelector('vaadin-grid-filter');
    root.querySelector('vaadin-date-picker')!.addEventListener('value-changed', (e: any) => {
      filter.value = e.detail.value;
    });
  }

  renderDate(root: HTMLElement, _column: any, rowData: any) {
    root.innerHTML = `<span>${this.dateFormatter.format(Date.parse(rowData.item.date))}</span>`;
  }
}
