import { Stack, StackProps, aws_ec2 } from "aws-cdk-lib";
import { Construct } from "constructs";

interface NetworkProps extends StackProps {
    cidr: string;
    ipAddresses?: aws_ec2.IIpAddresses
}

export class NetworkStack extends Stack {
    public readonly vpc: aws_ec2.Vpc;
    
    constructor(scope: Construct, id: string, props: NetworkProps) {
        super(scope, id, props);

        this.vpc = new aws_ec2.Vpc(this, 'VpcDemo',{
            vpcName: 'VpcDemo',
            maxAzs: 1,
            cidr: props.cidr,
            // ipAddresses: props.ipAddresses,
            subnetConfiguration: [
                {
                    name: 'PublicSubnet',
                    cidrMask: 24,
                    subnetType: aws_ec2.SubnetType.PUBLIC
                },
                {
                    name: 'PrivateSubnet',
                    cidrMask: 24,
                    subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS, // PRIVATE_WITH_NAT - Depcrecated
                },
                {
                    name: 'IsolatedSubnet',
                    cidrMask: 24,
                    subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED
                }
            ]
        })
    }
}