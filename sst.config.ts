import { SSTConfig } from "sst";
import { API } from "./stacks/API";
import { userInfo } from "os";
const username = userInfo().username;
export const user_stage = username.toLowerCase() + '-live';
const branch = process.env['branch']! || user_stage;

export default {
	config(_input) {
		if (user_stage === 'runner-live') {
			return {
				name: "modules",
				stage: branch,
				region: "ap-southeast-2",
			};
		}
		else {
			return {
				name: "modules",
				stage: user_stage,
				region: "ap-southeast-2",
			};
		}
	},
	stacks(app) {
		app.stack(API);
	}
} satisfies SSTConfig;
