import { Route } from '@vaadin/router';
import './views/helloworld/hello-world-view';
import './views/main-layout';

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  children?: ViewRoute[];
};

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'hello-world-view',
    icon: '',
    title: '',
  },
  {
    path: 'hello',
    component: 'hello-world-view',
    icon: 'la la-globe',
    title: 'Hello World',
  },
  {
    path: 'about',
    component: 'about-view',
    icon: 'la la-file',
    title: 'About',
    action: async (_context, _command) => {
      await import('./views/about/about-view');
      return;
    },
  },
  {
    path: 'dashboard',
    component: 'dashboard-view',
    icon: 'la la-chart-area',
    title: 'Dashboard',
    action: async (_context, _command) => {
      await import('./views/dashboard/dashboard-view');
      return;
    },
  },
  {
    path: 'card-list',
    component: 'card-list-view',
    icon: 'la la-list',
    title: 'Card List',
    action: async (_context, _command) => {
      await import('./views/cardlist/card-list-view');
      return;
    },
  },
  {
    path: 'list',
    component: 'list-view',
    icon: 'la la-th',
    title: 'List',
    action: async (_context, _command) => {
      await import('./views/list/list-view');
      return;
    },
  },
  {
    path: 'master-detail',
    component: 'master-detail-view',
    icon: 'la la-columns',
    title: 'Master-Detail',
    action: async (_context, _command) => {
      await import('./views/masterdetail/master-detail-view');
      return;
    },
  },
  {
    path: 'person-form',
    component: 'person-form-view',
    icon: 'la la-user',
    title: 'Person Form',
    action: async (_context, _command) => {
      await import('./views/personform/person-form-view');
      return;
    },
  },
  {
    path: 'address-form',
    component: 'address-form-view',
    icon: 'la la-map-marker',
    title: 'Address Form',
    action: async (_context, _command) => {
      await import('./views/addressform/address-form-view');
      return;
    },
  },
  {
    path: 'credit-card-form',
    component: 'credit-card-form-view',
    icon: '',
    title: 'Credit Card Form',
    action: async (_context, _command) => {
      await import('./views/creditcardform/credit-card-form-view');
      return;
    },
  },
  {
    path: 'editor',
    component: 'editor-view',
    icon: 'la la-edit',
    title: 'Editor',
    action: async (_context, _command) => {
      await import('./views/editor/editor-view');
      return;
    },
  },
  {
    path: 'image-list',
    component: 'image-list-view',
    icon: 'la la-th-list',
    title: 'Image List',
    action: async (_context, _command) => {
      await import('./views/imagelist/image-list-view');
      return;
    },
  },
  {
    path: 'checkout-form',
    component: 'checkout-form-view',
    icon: '',
    title: 'Checkout Form',
    action: async (_context, _command) => {
      await import('./views/checkoutform/checkout-form-view');
      return;
    },
  },
];
export const routes: ViewRoute[] = [
  {
    path: '',
    component: 'main-layout',
    children: [...views],
  },
];
