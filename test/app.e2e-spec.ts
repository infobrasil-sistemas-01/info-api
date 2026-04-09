import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PostOrderDto } from 'src/modules/order/dto/create-order.dto';
import { generateDate, generateHour, generateId } from 'src/utils/generators.util';

describe('API E2E Tests', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  const TEST_CREDENTIALS = Buffer.from(
    'infomobile:yd9FvSJ69bz6zvRq7GM&TJ5RD6*DsQPf',
  ).toString('base64');

  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });

  let orderId;

  describe('Auth Flow', () => {
    it('POST /api/v1/auth/login - should login with Basic credentials and return tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Authorization', `Basic ${TEST_CREDENTIALS}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('POST /api/v1/auth/refresh - should return new access_token using refresh_token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refresh_token: refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');

      accessToken = response.body.access_token;
    });
  });

  describe('Protected GET Endpoints', () => {
    const authHeader = () => ({ Authorization: `Bearer ${accessToken}` });

    describe('GET /api/v1/orders', () => {
      it('should return 200 with valid token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/orders')
          .set(authHeader())
          .expect(200);
      });

      it('should return 200 with pagination query params', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/orders?page=1&pageSize=10')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer()).get('/api/v1/orders').expect(401);
      });
    });

    describe('GET /api/v1/orders/:id', () => {
      it('should return 200 with valid token and order id', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/orders/1')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer()).get('/api/v1/orders/1').expect(401);
      });
    });

    describe('GET /api/v1/products', () => {
      it('should return 200 with valid token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products')
          .set(authHeader())
          .expect(200);
      });

      it('should return 200 with all query params', async () => {
        await request(app.getHttpServer())
          .get(
            '/api/v1/products?page=1&pageSize=10&group=1&brand=2&minStock=5&search=test',
          )
          .set(authHeader())
          .expect(200);
      });

      it('should return 200 with partial query params', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products?page=2&pageSize=20')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer()).get('/api/v1/products').expect(401);
      });
    });

    describe('GET /api/v1/products/id/:id', () => {
      it('should return 200 with valid token and product id', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/id/1')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/id/1')
          .expect(401);
      });
    });

    describe('GET /api/v1/products/barcode/:barcode', () => {
      it('should return 200 or 404 with valid token (depends on database)', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/v1/products/barcode/123456789')
          .set(authHeader());

        expect([200, 404]).toContain(response.status);
      });

      it('should return 401 without token', async () => {
        const response = await request(app.getHttpServer()).get(
          '/api/v1/products/barcode/123456789',
        );

        expect([401, 404]).toContain(response.status);
      });
    });

    describe('GET /api/v1/payment-methods', () => {
      it('should return 200 with valid token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/payment-methods')
          .set(authHeader())
          .expect(200);
      });

      it('should return 200 with pagination query params', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/payment-methods?page=1&pageSize=10')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/payment-methods')
          .expect(401);
      });
    });

    describe('GET /api/v1/products/brands', () => {
      it('should return 200 with valid token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/brands')
          .set(authHeader())
          .expect(200);
      });

      it('should return 200 with pagination query params', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/brands?page=1&pageSize=10')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/brands')
          .expect(401);
      });
    });

    describe('GET /api/v1/products/groups', () => {
      it('should return 200 with valid token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/groups')
          .set(authHeader())
          .expect(200);
      });

      it('should return 200 with pagination query params', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/groups?page=1&pageSize=10')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/products/groups')
          .expect(401);
      });
    });

    describe('POST /api/v1/orders', () => {
      it('should return 200 with valid token', async () => {
        const dto: PostOrderDto = {
          id: generateId(),
          date: generateDate(),
          hour: generateHour(),
          store_note: 'Teste automatizado (E2E)',
          installment: 1,
          payment_method: '1',
          payment_date: generateDate(),
          has_payment: true,
          has_invoice: true,
          products_sold: [
            {
              product_id: 1,
              quantity: 1
            },
          ],
        };

        const response = await request(app.getHttpServer())
          .post('/api/v1/orders')
          .set(authHeader())
          .send(dto)
          .expect(201);

        orderId = response.body.orderId;
        expect(orderId).toBeDefined();
      });
    });

    describe('GET /api/v1/orders', () => {
      it('should return 200 with valid token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/orders')
          .set(authHeader())
          .expect(200);
      });

      it('should return 200 with pagination query params', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/orders?page=1&pageSize=10')
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/orders')
          .expect(401);
      });
    });

    describe('GET /api/v1/orders/:id', () => {
      it('should return 200 with valid token and order id', async () => {
        await request(app.getHttpServer())
          .get(`/api/v1/orders/${orderId}`)
          .set(authHeader())
          .expect(200);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .get(`/api/v1/orders/${orderId}`)
          .expect(401);
      });
    });

    describe('POST /api/v1/orders/:id/receipt', () => {
      it('should return 200 with valid token and order id', async () => {
        await request(app.getHttpServer())
          .post(`/api/v1/orders/${orderId}/receipt`)
          .send({
            email: 'teste@email.com',
            cpf: '12345678909'
          })
          .set(authHeader())
          .expect(201);
      });

      it('should return 401 without token', async () => {
        await request(app.getHttpServer())
          .post(`/api/v1/orders/${orderId}/receipt`)
          .send({
            email: 'teste@email.com',
            cpf: '12345678909'
          })
          .expect(401);
      });
    });
  });
});
