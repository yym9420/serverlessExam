#!/usr/bin/env node
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { RestApi, LambdaIntegration, Resource, MethodOptions } from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';

export class NewEndpointStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define Lambda function
    const handler = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('path/to/your/lambda/code')
    });

    // Create REST API
    const api = new RestApi(this, 'MyRestApi');

    // Define request parameters
    const role = api.root.addResource('crew');
    const roleId = role.addResource('{roleId}');
    const movie = roleId.addResource('movies');
    const movieId = movie.addResource('{movieId}');

    // Define GET method with query string
    const queryStringOptions: MethodOptions = {
      requestParameters: {
        'method.request.querystring.name': true
      }
    };

    const integration = new LambdaIntegration(handler);
    movieId.addMethod('GET', integration, queryStringOptions);
  }
}

// Lambda function handler
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  // Parse query parameters
  const queryStringParameters = event.queryStringParameters;
  const subString = queryStringParameters?.name;

  // Logic to filter results based on substring
  // This logic depends on how your data is structured and accessed

  // Return response
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Request processed successfully' })
  };
}

