import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2, aws_dynamodb as dynamodb, aws_iam as iam, aws_lambda as lambda, aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';

export class AlEdtechMicroserviceStackAwsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // VPC Configuration
        const vpc = new ec2.Vpc(this, 'ALVPC', {
            cidr: '10.0.0.0/16',
            subnetConfiguration: [
                {
                    name: 'PublicSubnet',
                    subnetType: ec2.SubnetType.PUBLIC,
                    cidrMask: 24
                },
                {
                    name: 'PrivateSubnet',
                    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidrMask: 24
                },
                {
                    name: 'IsolatedSubnet',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 24
                }
            ]
        });

        // DynamoDB Table
        const table = new dynamodb.Table(this, 'EmployeesTable', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
            tableName: 'employees'
        });

        // Lambda Function
        const nodeJsFunctionProps: NodejsFunctionProps = {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: path.join(__dirname, '../lambda/lambda-handler.ts'), // Ensure this path is correct
            bundling: {
                externalModules: ['aws-sdk'],
                minify: false,
                sourceMap: true,
                // Use local bundling to avoid Docker
                nodeModules: ['aws-sdk'],
                forceDockerBundling: false // Ensure bundling is done locally
            }
        };

        const backendLambda = new NodejsFunction(this, 'BackendLambda', nodeJsFunctionProps);

        // API Gateway
        const api = new apigateway.RestApi(this, 'ALWorldAPI', {
            restApiName: 'ALWorldAPI',
            description: 'This service serves the AL World application.'
        });

        const getIntegration = new apigateway.LambdaIntegration(backendLambda, {
            requestTemplates: { 'application/json': '{"statusCode": 200}' }
        });

        api.root.addMethod('GET', getIntegration); // GET /

        // Security Groups
        const publicInstanceSecurityGroup = new ec2.SecurityGroup(this, 'PublicInstanceSG', {
            vpc,
            description: 'Allow ssh and http access to ec2 instances from anywhere',
            allowAllOutbound: true
        });
        publicInstanceSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from anywhere');
        publicInstanceSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow http access from anywhere');

        const privateInstanceSecurityGroup = new ec2.SecurityGroup(this, 'PrivateInstanceSG', {
            vpc,
            description: 'Allow backend communication',
            allowAllOutbound: true
        });

        // EC2 Instances
        const publicInstance = new ec2.Instance(this, 'PublicInstance', {
            vpc,
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: new ec2.AmazonLinuxImage(),
            securityGroup: publicInstanceSecurityGroup,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
        });

        const privateInstance = new ec2.Instance(this, 'PrivateInstance', {
            vpc,
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: new ec2.AmazonLinuxImage(),
            securityGroup: privateInstanceSecurityGroup,
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }
        });

        // Grant the backend Lambda access to the DynamoDB table
        table.grantReadWriteData(backendLambda);
    }
}
