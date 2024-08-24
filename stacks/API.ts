import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { StackContext, Api } from 'sst/constructs'
import sstConfig, { path } from '../sst.config'

const certArn = process.env['CERT_ARN'] || '';


export function API({ stack }: StackContext) {
    const api = new Api(stack, 'Api', {
        routes: {
            'GET /': 'packages/functions/src/home.handler',
            'GET /imdb': 'packages/functions/src/imdb.handler',
        },
        customDomain: {
            domainName: 'api.ashleyjackson.net',
            path: path,
            isExternalDomain: true,
            cdk: {
                certificate: Certificate.fromCertificateArn(stack, 'Certificate', certArn),
            }
        },
    });
    stack.addOutputs({
        ApiEndpoint: api.url,
    })
}
