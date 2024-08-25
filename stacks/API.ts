import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { StackContext, Api } from 'sst/constructs'

const certArn = process.env['CERT_ARN'] as string

export function API({ stack }: StackContext) {
    const api = new Api(stack, 'Api', {
        routes: {
            'GET /': 'packages/functions/src/home.handler',
            'GET /imdb/list/{id}': 'packages/functions/src/imdb/list.handler',
            'GET /imdb/title/{id}': 'packages/functions/src/imdb/title.handler',
            'GET /email/validate/{email}': 'packages/functions/src/email/validate.handler',
        },
        customDomain: {
            domainName: 'api.ashleyjackson.net',
            isExternalDomain: true,
            cdk: {
                certificate: Certificate.fromCertificateArn(stack, 'Certificate', certArn),
            }
        },
    });
    stack.addOutputs({
        ApiEndpoint: api.url,
    })
    stack.setDefaultFunctionProps({
        timeout: 30,
        memorySize: 128,
    });
}
