import axios from 'axios';
import * as https from 'https';

const apiGatewayUrl = 'https://o1cfqzl904.execute-api.ap-south-1.amazonaws.com/prod/';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

describe('AL World Infrastructure', () => {

    it('should verify the DynamoDB table exists', async () => {
        // Your DynamoDB check logic (if needed)
    });

    it('should create a new employee (POST)', async () => {
        const employee = {
            id: "10",
            name: "John Doe",
            role: "Developer"
        };

        const response = await axios.post(`${apiGatewayUrl}/employees`, employee, { httpsAgent });
        expect(response.status).toBe(201);
        expect(response.data).toEqual({
            "message": "Employee created"
        });
        // expect(response.data).toHaveProperty('id', '1');
    });

    it('should retrieve an employee by ID (GET)', async () => {
        const response = await axios.get(`${apiGatewayUrl}/employees/10`, { httpsAgent });
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            "id": "10",
            "role": "Developer",
            "name": "John Doe"
        });
    });

    it('should update an employee by ID (PATCH)', async () => {
        const updateData = {
            name: "John Doe Updated",
            role: "Senior Developer"
        };

        const response = await axios.patch(`${apiGatewayUrl}/employees/10`, updateData, { httpsAgent });
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            "message": "Employee updated"
        });
    });

    it('should delete an employee by ID (DELETE)', async () => {
        const response = await axios.delete(`${apiGatewayUrl}/employees/10`, { httpsAgent });
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            "message": "Employee deleted"
        });
    });

});
