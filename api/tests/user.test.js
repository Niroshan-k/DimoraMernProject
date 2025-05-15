import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js'; // Import your Express app

let mongoServer;

beforeAll(async () => {
     mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Disconnect any existing connection
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Connect to the new in-memory database
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('User API Tests', () => {
    it('should create a new user', async () => {
         const res = await request(app)
             .post('/api/auth/signup')
             .send({
                 username: 'testuser',
                 email: 'testuser@example.com',
                 password: 'password123',
                 role: 'customer',
             });

         expect(res.statusCode).toBe(201);
         expect(res.body).toHaveProperty('success', true);
         expect(res.body).toHaveProperty('message', 'User created successfully'); // Adjusted to match the actual response
     });

    it('should fail to create a user with an existing email', async () => {
        const res = await request(app)
             .post('/api/auth/signup')
             .send({
                 username: 'testuser2',
                 email: 'testuser@example.com', // Duplicate email
                 password: 'password123',
                 role: 'customer',
             });

         expect(res.statusCode).toBe(400); // Expect a 400 status code for duplicate email
         expect(res.body).toHaveProperty('success', false);
         expect(res.body).toHaveProperty('message', 'Email already exists');
    });
});