require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const baseConfig = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'missiontrack',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  dialect: 'postgres',
  logging: false
};

module.exports = {
  development: {
    ...baseConfig
  },
  test: {
    ...baseConfig,
    database: `${baseConfig.database}_test`
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true'
    }
  }
};



