import prisma from '../config/db';
import { RegisterInput, LoginInput } from '../validations/authValidation';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const registerUser = async (input: any) => {
  const { fullName, name, email, password } = input;
  const resolvedFullName = fullName || name || '';

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email is already registered', 400);
  }

  // 2. Hash password
  const passwordHash = await hashPassword(password);

  // 3. Create user (role defaults to USER)
  const user = await prisma.user.create({
    data: {
      fullName: resolvedFullName,
      email,
      password: passwordHash,
      role: 'USER',
    },
  });

  // 4. Return user info without password
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // 2. Verify password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // 3. Generate Token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // 4. Return user and token
  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
