import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const dataSource: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'db',
  database: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  entities: ['src/**/**.entity{.ts,.js}'],
  synchronize: true,
};

export default dataSource;
