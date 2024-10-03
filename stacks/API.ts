import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { StackContext, Api } from 'sst/constructs'
import routes from '../packages/functions/common/routes'
import { stage } from '../packages/functions/common/consts'

let domain: string

export function API({ stack }: StackContext) {

	stack.setDefaultFunctionProps({
		runtime: 'nodejs18.x',
		memorySize: 256,
		timeout: 30,
	});

	if (stage.includes('live')) {
		domain = stage + '.ashleyjackson.net'
	} else if (stage === 'v1') {
		domain = 'api.ashleyjackson.net'
	}
	const api = new Api(stack, 'Api', {
		routes: routes,
		customDomain: {
			path: stage,
			domainName: domain,
			isExternalDomain: true,
			cdk: {
				certificate: Certificate.fromCertificateArn(stack, 'Certificate', "arn:aws:acm:ap-southeast-2:703757905289:certificate/fd977540-0d7c-4cbe-abd6-9b0b4e6ca606"),
			}
		},
	});
	stack.addOutputs({
		apiEndpoint: api.url,
		stage: stage,
	})
}
