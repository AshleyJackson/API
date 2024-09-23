import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { StackContext, Api } from 'sst/constructs'
import sstConfig from "../sst.config";

let domain: string

export function API({ stack }: StackContext) {

	const stage = sstConfig.config({}).stage

	if (stage === 'API') {
		domain = 'api.ashleyjackson.net'
	} else {
		domain = `${stage}.ashleyjackson.net`
	}

	const api = new Api(stack, 'Api', {
		routes: {
			'GET /': 'packages/functions/src/home.handler',
			'GET /imdb/list/{id}': 'packages/functions/src/imdb/list.handler',
			'GET /imdb/title/{id}': 'packages/functions/src/imdb/title.handler',
			'GET /email/validate/{email}': 'packages/functions/src/email/validate.handler',
		},
		customDomain: {
			domainName: domain,
			isExternalDomain: true,
			cdk: {
				certificate: Certificate.fromCertificateArn(stack, 'Certificate', "arn:aws:acm:ap-southeast-2:703757905289:certificate/fd977540-0d7c-4cbe-abd6-9b0b4e6ca606"),
			}
		},
	});
	stack.addOutputs({
		ApiEndpoint: api.url,
	})
}
