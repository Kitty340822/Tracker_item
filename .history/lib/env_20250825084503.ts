const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'http://localhost:3000',
  API_KEY: process.env.API_KEY || '',
  API_SECRET: process.env.API_SECRET || '',
};
export default env;