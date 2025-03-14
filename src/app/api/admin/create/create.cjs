const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
require('dotenv').config();

// If DATABASE_URL is not set, set a default
if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL not found in environment, using default SQLite path');
  process.env.DATABASE_URL = 'file:../prisma/dev.db';
}

// Create a new PrismaClient instance
const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    const name = await question('Enter admin name (optional, press enter to skip): ');

    // Validate input
    if (!email || !password) {
      console.error('Email and password are required');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.error('Admin with this email already exists');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    });

    console.log('Admin created successfully!');
    console.log('Email:', newAdmin.email);
    console.log('Name:', newAdmin.name || 'Not provided');

  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdmin();