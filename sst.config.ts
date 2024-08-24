import { SSTConfig } from 'sst';
import { API } from './stacks/API';
import { userInfo } from 'os';
const username = userInfo().username;
export const path = process.env['branch'] === 'master' ? '' : `/${username}-live/`;

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
