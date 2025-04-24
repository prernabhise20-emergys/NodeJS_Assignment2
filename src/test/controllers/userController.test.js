import { request } from 'express';
// import { register } from '../../controllers/userController.js'

describe('POST', () => {
    it('should create new user', async () => {
        const newUser = {
            email: 'prerna@gmail.com',
            user_password: '123456',
            first_name: 'Prerna',
            last_name: 'Bhise',
            mobile_number: '1234567867',
            userCode: DR223
        };
        const response = await request().post('/api/user/register').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(newUser.email)
    })

    it('should return 404 if same user is exists', async () => {
        const response = await request(app).post('/api/user/register').send({});
        expect(response.status).toBe(404);
        expect(response.text).toBe('User already exists');
    });
   
})


