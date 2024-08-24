import { SSTConfig } from 'sst';
import { API } from './stacks/API';

export default {
  config(_input) {
      return {
        name: "api",
        region: "ap-southeast-2",
        stage: 'prod'
    }
  },
  stacks(app) {
    app.stack(API);
  }
} satisfies SSTConfig;
