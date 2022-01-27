import { stub } from 'sinon';

/**
 * Mock the `showNotification` to avoid adding extra DOM elements
 * that remain under the document after the test has completed.
 */
export const showNotification = stub();
