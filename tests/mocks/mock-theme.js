import { stub } from 'sinon';

/**
 * Mock the `applyTheme` to avoid adding extra configuration
 * required for importing CSS files in web-test-runner.
 */
export const applyTheme = stub();
