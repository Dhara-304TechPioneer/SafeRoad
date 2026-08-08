import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/db';
import { generateToken } from '../src/utils/jwt';

describe('Admin Officer Management Integration Tests', () => {
  let adminId: string;
  let adminToken: string;
  let citizenId: string;
  let citizenToken: string;
  let createdOfficerUserId: string;
  let createdOfficerId: string;
  const testEmail = `officer_test_${Date.now()}@saferoad.gov.in`;

  beforeAll(async () => {
    await prisma.$connect();

    // Create Admin User
    const admin = await prisma.user.create({
      data: {
        fullName: 'Admin Test Governance',
        email: `admin_gov_${Date.now()}@saferoad.gov.in`,
        password: 'password-not-used-in-hash',
        role: 'ADMIN',
      },
    });
    adminId = admin.id;
    adminToken = generateToken({ userId: admin.id, email: admin.email, role: 'ADMIN' });

    // Create Citizen User
    const citizen = await prisma.user.create({
      data: {
        fullName: 'Citizen Public Tester',
        email: `citizen_pub_${Date.now()}@saferoad.org`,
        password: 'password-not-used-in-hash',
        role: 'USER',
      },
    });
    citizenId = citizen.id;
    citizenToken = generateToken({ userId: citizen.id, email: citizen.email, role: 'USER' });
  });

  afterAll(async () => {
    try {
      if (createdOfficerId) {
        await prisma.officer.deleteMany({ where: { id: createdOfficerId } });
      }
      await prisma.user.deleteMany({
        where: {
          id: { in: [adminId, citizenId, createdOfficerUserId].filter(Boolean) },
        },
      });
    } catch (err) {
      console.warn('Cleanup warning:', err);
    } finally {
      await prisma.$disconnect();
    }
  });

  it('1. Reject officer creation requests from non-admin users (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/users/officers')
      .set('Authorization', `Bearer ${citizenToken}`)
      .send({
        fullName: 'Unauthorized Officer Attempt',
        email: 'unauth@saferoad.test',
        password: 'Password123!',
      });

    expect(res.status).toBe(403);
  });

  it('2. Reject unauthenticated officer creation requests (401 Unauthorized)', async () => {
    const res = await request(app)
      .post('/api/users/officers')
      .send({
        fullName: 'No Token Attempt',
        email: 'notoken@saferoad.test',
        password: 'Password123!',
      });

    expect(res.status).toBe(401);
  });

  it('3. Successfully create a new Officer account as Admin (POST /api/users/officers)', async () => {
    const res = await request(app)
      .post('/api/users/officers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        fullName: 'Officer Vikram Singh',
        email: testEmail,
        password: 'OfficerPassword123!',
        departmentName: 'Traffic Operations',
        badgeNumber: 'BADGE-TEST-900',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.user.role).toBe('OFFICER');
    expect(res.body.data.officer.badgeNumber).toBe('BADGE-TEST-900');

    createdOfficerUserId = res.body.data.user.id;
    createdOfficerId = res.body.data.officer.id;
  });

  it('4. List officers as Admin (GET /api/users/officers)', async () => {
    const res = await request(app)
      .get('/api/users/officers')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data.officers)).toBe(true);

    const found = res.body.data.officers.find(
      (o: any) => o.user.email === testEmail
    );
    expect(found).toBeDefined();
    expect(found.badgeNumber).toBe('BADGE-TEST-900');
    expect(found.department.name).toBe('Traffic Operations');
  });

  it('5. Newly created Officer can log in at POST /api/auth/login and receives OFFICER role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'OfficerPassword123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.role).toBe('OFFICER');
  });

  it('6. Officer user cannot access Admin officers endpoint (403 Forbidden)', async () => {
    const officerToken = generateToken({
      userId: createdOfficerUserId,
      email: testEmail,
      role: 'OFFICER',
    });

    const res = await request(app)
      .get('/api/users/officers')
      .set('Authorization', `Bearer ${officerToken}`);

    expect(res.status).toBe(403);
  });

  it('7. Admin can update a user role (PATCH /api/users/:id/role)', async () => {
    const res = await request(app)
      .patch(`/api/users/${citizenId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'OFFICER' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('OFFICER');

    // Revert role
    await request(app)
      .patch(`/api/users/${citizenId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'USER' });
  });
});
