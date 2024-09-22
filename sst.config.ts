import { SSTConfig } from "sst";
import { API } from "./stacks/API";
import { userInfo } from "os";
const username = userInfo().username;
const user_stage = username.toLowerCase();

export default {
	config(_input) {
		// v GitHub Actions
		if (user_stage === 'runner') {
			return {
				name: "API",
				stage: 'API',
				region: "ap-southeast-2",
			};
		}
		// v Local
		else {
			return {
				name: "API",
				stage: user_stage,
				region: "ap-southeast-2",
			};
		}
	},
	stacks(app) {
		app.stack(API);
	}
} satisfies SSTConfig;
