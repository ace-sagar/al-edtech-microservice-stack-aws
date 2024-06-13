// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import * as AlEdtechMicroserviceStackAws from '../lib/al-edtech-microservice-stack-aws-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/al-edtech-microservice-stack-aws-stack.ts
test('SQS Queue Created', () => {
    //   const app = new cdk.App();
    //     // WHEN
    //   const stack = new AlEdtechMicroserviceStackAws.AlEdtechMicroserviceStackAwsStack(app, 'MyTestStack');
    //     // THEN
    //   const template = Template.fromStack(stack);

    //   template.hasResourceProperties('AWS::SQS::Queue', {
    //     VisibilityTimeout: 300
    //   });
});

import * as AWS from 'aws-sdk';

describe('AL World Infrastructure', () => {
    it('should verify the DynamoDB table exists', async () => {
        const dynamodb = new AWS.DynamoDB();
        const tableName = 'employees';
        const params = {
            TableName: tableName
        };
        try {
            const data = await dynamodb.describeTable(params).promise();
            if (data.Table)
                expect(data.Table.TableName).toEqual(tableName);
            else 
                console.warn("Table data is undefined");
        } catch (err) {
            throw new Error(`DynamoDB table ${tableName} does not exist`);
        }
    });

    it('should verify the API Gateway endpoint is reachable', async () => {
        const apiGatewayUrl = 'https://05uoql8muf.execute-api.ap-south-1.amazonaws.com/prod/employees/123';
        const response = await fetch(apiGatewayUrl);
        expect(response.status).toBe(200);
    });
});
