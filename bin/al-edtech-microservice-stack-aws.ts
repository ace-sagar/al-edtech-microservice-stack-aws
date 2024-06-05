#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AlEdtechMicroserviceStackAwsStack } from '../lib/al-edtech-microservice-stack-aws-stack';
import { NetworkStack } from '../lib/network-stack';
import { ApplicationStack } from '../lib/application-stack';

const app = new cdk.App();
new AlEdtechMicroserviceStackAwsStack(app, 'AlEdtechMicroserviceStackAwsStack', {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

// Network Stack
const network = new NetworkStack(app, 'NetworkStack', {
    cidr: '10.0.0.0/20',
    ipAddresses: cdk.aws_ec2.IpAddresses.cidr('10.0.0.0/16')
});

const application = new ApplicationStack(app, 'ApplicationStack', {
    vpc: network.vpc,
    keyName: 'Ec2KeyPairDemo'
});

// wait for the network stack to deploy before the application stack
application.addDependency(network);