import bcrypt from 'bcryptjs';

// Generate a secure hash for the password 'Admin@123'
const password = 'password';
const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('Hashed password:', hash);