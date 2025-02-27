import { createInterface } from 'readline';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    readline.question(query, resolve);
  });
};

async function createAdmin() {
  try {
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
    readline.close();
    process.exit(0);
  }
}

createAdmin();