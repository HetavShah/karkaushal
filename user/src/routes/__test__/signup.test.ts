import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      name: 'hetavShah',
      gender: 'male',
      age: 45,

      shippingAddress: {
        address: '32 bill block , san fransisco',
        city: 'Chicago',
        postalCode: '1234567',
        country: 'India',
      },
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "ThisisnotAnEmail",
    password: "password",
    name: "hetavShah",
    gender: "male",
    age: 45,

    shippingAddress: {
      address: "32 bill block , san fransisco",
      city: "Chicago",
      postalCode: "1234567",
      country: "India",
    },
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
      name: "hetavShah",
      gender: "male",
      age: 45,

      shippingAddress: {
        address: "32 bill block , san fransisco",
        city: "Chicago",
        postalCode: "1234567",
        country: "India",
      },
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("not allow duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      name: "hetavShah",
      gender: "male",
      age: 45,

      shippingAddress: {
        address: "32 bill block , san fransisco",
        city: "Chicago",
        postalCode: "1234567",
        country: "Mexico",
      },
    })
    .expect(201);

  await request(app)
  .post("/api/users/signup")
  .send({
    email: "test@test.com",
    password: "password",
    name: "hetavShah",
    gender: "male",
    age: 45,

    shippingAddress: {
      address: "32 bill block , san fransisco",
      city: "Chicago",
      postalCode: "1234567",
      country: "India",
    },
  })
  .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
      name: "hetavShah",
      gender: "male",
      age: 45,

      shippingAddress: {
        address: "32 bill block , san fransisco",
        city: "Chicago",
        postalCode: "1234567",
        country: "India",
      },
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
