import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { StackContext, Api } from 'sst/constructs'

export function API({ stack }: StackContext) {
    const api = new Api(stack, 'Api', {
        routes: {
            'GET /': 'packages/functions/src/home.handler',
            'GET /imdb': 'packages/functions/src/imdb.handler',
        },
        customDomain: {
            domainName: 'api.ashleyjackson.net',
            isExternalDomain: true,
            cdk: {
                certificate: Certificate.fromCertificateArn(stack, 'Certificate', '$HIDDEN'),
            }
        }
    });
    stack.addOutputs({
        ApiEndpoint: api.url,
    })
}
