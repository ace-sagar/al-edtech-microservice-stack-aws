import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, 'SQSLambdaDemoQueue', {
            visibilityTimeout: cdk.Duration.seconds(300)
        });

        // Lambda function
        const sqsLambda = new cdk.aws_lambda.Function(this, 'SQSLambda', {
            handler: 'lambda-handler.handler',
            runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
            code: cdk.aws_lambda.Code.fromAsset('lambda')
        });

        // Create event source
        const sqs_event_source = new cdk.aws_lambda_event_sources.SqsEventSource(queue);

        // Add SQS event source to lambda
        sqsLambda.addEventSource(sqs_event_source);


        // Lambda Role
        // const lambdaRole = new cdk.aws_iam.Role(this, 'lambdaRole', {
        //     roleName: 'lambda-role-test-dev',
        //     description: '',
        //     assumedBy: new cdk.aws_iam.ServicePrincipal('lambda-amazonaws.com'),
        //     managedPolicies: [cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('ReadonlyAccess')]
        // });

        // Attach inline policies to lambda role
        // lambdaRole.attachInlinePolicy(
        //     new cdk.aws_iam.Policy(this, 'lambdaExecutionAccess', {
        //         policyName: 'lambdaExecutionAccess',
        //         statements: [
        //             new cdk.aws_iam.PolicyStatement({
        //                 effect: cdk.aws_iam.Effect.ALLOW,
        //                 resources: ['*'],
        //                 actions: [
        //                     'logs: CreateLogGroup',
        //                     'logs: CreateLogStream',
        //                     'logs: DescribeLogGroups',
        //                     'logs: DescribeLogStreams',
        //                     'logs: PutLogEvents',
        //                 ]
        //             })
        //         ]
        //     })
        // );

        // Import Existing VPC based on VPC ID
        // const vpc = cdk.aws_ec2.Vpc.fromLookup(this, 'VpcDemo', {
        //     vpcName: 'VpcDemo' 
        // })
    }
}