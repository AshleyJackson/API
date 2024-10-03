import { SSTConfig } from "sst";
import { API } from "./stacks/API";
import { username, stage } from "./packages/functions/common/consts";


export default {
	config(_input) {
		console.log('username:', username)
		if (username === 'runner-live') { // GitHub Actions
			return {
				name: 'API',
				stage: stage,
				region: 'ap-southeast-2',
			}
		} else { // Local
			return {
				name: 'API',
				stage: username + '-live',
				region: 'ap-southeast-2',
			}
		}
	},
	stacks(app) {
		app.stack(API);
	}
} satisfies SSTConfig;
