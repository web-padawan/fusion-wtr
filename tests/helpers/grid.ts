import { GridElement } from '@vaadin/vaadin-grid';

export const getRows = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll('tr'));
};

export const getRowCells = (row: HTMLElement): HTMLElement[] => {
  return Array.from(row.querySelectorAll('[part~="cell"]'));
};

export const getCellContent = (cell: HTMLElement): HTMLElement => {
  return cell.querySelector('slot').assignedNodes()[0] as HTMLElement;
};

export const getContainerCell = (container: HTMLElement, row: number, col: number): HTMLElement => {
  const rows = getRows(container);
  const cells = getRowCells(rows[row]);
  return cells[col];
};

export const getContainerCellContent = (container: HTMLElement, row: number, col: number): HTMLElement => {
  return getCellContent(getContainerCell(container, row, col));
};

export const getHeaderCellContent = (grid: GridElement, row: number, col: number): HTMLElement => {
  const container = grid.shadowRoot.getElementById('header');
  return getContainerCellContent(container, row, col);
};

export const getBodyCellContent = (grid: GridElement, row: number, col: number): HTMLElement => {
  const container = grid.shadowRoot.getElementById('items');
  return getContainerCellContent(container, row, col);
};

