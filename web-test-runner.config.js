const path = require('path');
const { fromRollup } = require('@web/dev-server-rollup');
const { esbuildPlugin } = require('@web/dev-server-esbuild');
const { importMapsPlugin } = require('@web/dev-server-import-maps');
const rollupAlias = require('@rollup/plugin-alias');

const alias = fromRollup(rollupAlias);

const projectRootDir = path.resolve(__dirname);

const MOCKS = '/tests/mocks';

module.exports = {
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ ts: true }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            // Use mobx development build to avoid error due to `process.env.NODE_ENV`
            // See https://github.com/mobxjs/mobx/issues/2564#issuecomment-759406946
            mobx: './node_modules/mobx/dist/mobx.esm.development.js',
            // mock theme to avoid using plugins to import CSS
            'Frontend/generated/theme': `${MOCKS}/mock-theme.js`,
            // Mock the notification utility to avoid polluting DOM.
            '@vaadin/flow-frontend/a-notification': `${MOCKS}/mock-notification.js`,
            // Mock the Fusion endpoints to avoid network requests.
            'Frontend/generated/SamplePersonEndpoint': `${MOCKS}/endpoints/SamplePersonEndpoint.js`
          },
        },
      },
    }),
    alias({
      entries: [
        {
          find: 'Frontend',
          replacement: path.resolve(projectRootDir, 'frontend'),
        },
      ],
    }),
  ],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000'
    }
  },
};
