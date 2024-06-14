import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME || 'employees';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        switch (event.httpMethod) {
            case 'GET':
                response = await handleGet(event);
                break;
            case 'POST':
                response = await handlePost(event);
                break;
            case 'DELETE':
                response = await handleDelete(event);
                break;
            case 'PATCH':
                response = await handlePatch(event);
                break;
            default:
                response = {
                    statusCode: 405,
                    body: JSON.stringify({ message: 'Method Not Allowed' })
                };
        }
    } catch (error: any) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error })
        };
    }

    return response;
};

const handleGet = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing ID' })
        };
    }

    const params = {
        TableName: tableName!,
        Key: { id }
    };

    const data = await dynamodb.get(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(data.Item)
    };
};

const handlePost = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body!);

    const params = {
        TableName: tableName!,
        Item: body
    };

    await dynamodb.put(params).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Employee created' })
    };
};

const handleDelete = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing ID' })
        };
    }

    const params = {
        TableName: tableName!,
        Key: { id }
    };

    await dynamodb.delete(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Employee deleted' })
    };
};

const handlePatch = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id;
    const body = JSON.parse(event.body!);

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing ID' })
        };
    }

    const params = {
        TableName: tableName!,
        Key: { id },
        UpdateExpression: 'set #name = :name, #role = :role',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#role': 'role'
        },
        ExpressionAttributeValues: {
            ':name': body.name,
            ':role': body.role
        }
    };

    await dynamodb.update(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Employee updated' })
    };
};
