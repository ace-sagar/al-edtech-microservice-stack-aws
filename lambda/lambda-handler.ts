import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const params = {
            TableName: tableName,
        };

        const data = await dynamodb.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch employees' }),
        };
    }
};
