#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RestAPIStack } from '../lib/rest-api-stack';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Stack, StackProps } from '@aws-cdk/core';

export class NewEndpointStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Define a Lambda function
    const handler = new lambda.Function(this, 'CrewHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'), // assuming your Lambda code is in a folder named 'lambda'
    });

    // Define an API Gateway REST API
    const api = new apigateway.RestApi(this, 'CrewAPI', {
      restApiName: 'Crew Service',
      description: 'This service serves crew information for movies.',
    });

  
    const getCrewIntegration = new apigateway.LambdaIntegration(handler);
    const crew = api.root.addResource('crew');
    const role = crew.addResource('{role}');
    const movies = role.addResource('movies');
    const movieId = movies.addResource('{movieId}');
    movieId.addMethod('GET', new apigateway.LambdaIntegration(handler));
  }
}


const app = new cdk.App();
new NewEndpointStack(app, 'NewEndpointStack');
new RestAPIStack(app, 'RestAPIStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: { region: 'eu-west-1' },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});