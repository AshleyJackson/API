import { SSTConfig } from "sst";
import { API } from "./stacks/API";
import { userInfo, hostname } from "os";
const username = userInfo().username;
const hsn = hostname();
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
				stage: hsn,
				region: "ap-southeast-2",
			};
		}
	},
	stacks(app) {
		app.stack(API);
	}
} satisfies SSTConfig;
