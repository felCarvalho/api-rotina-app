import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { userSchema } from './user/user.entity';
import { categorySchema } from './category/category.entity';
import { credentialsSchema } from './authentication/entity/credentials.entity';
import { taskSchema } from './task/task.entity';
import { passHashSchema } from './authentication/entity/passHash.entity';
import { roleSchema } from './authentication/entity/role.entity';
import { permissionsSchema } from './authentication/entity/permissions.entity';
import { userRolesSchema } from './authentication/entity/userRoles.entity';
import { rolesPermissionsSchema } from './authentication/entity/rolesPermissions.entity';
import { refreshTokenSchema } from './authentication/entity/refresh-token.entity';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { TaskModule } from './task/task.module';
import { CreateUserModule } from './shared/orchestrators/create-user/create-user.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoryModule } from './category/category.module';
import { ModuleCore } from './shared/moduleCore/module.core';
import { CreateRotinaModule } from './shared/orchestrators/create-rotina/create-rotina.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.database', '.env.secrets.jwt', '.env'],
    }),
    TaskModule,
    CreateUserModule,
    UserModule,
    AuthenticationModule,
    ModuleCore,
    CategoryModule,
    CreateRotinaModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => ({
        entities: [
          userSchema,
          categorySchema,
          passHashSchema,
          roleSchema,
          permissionsSchema,
          userRolesSchema,
          credentialsSchema,
          taskSchema,
          rolesPermissionsSchema,
          refreshTokenSchema,
        ],
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        user: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        dbName: configService.get('POSTGRES_DB'),
        debug: true,
        extensions: [Migrator],
        timezone: '+00:00',
        migrations: {
          path: './dist/migrations',
          pathTs: './src/migrations',
          tableName: 'mikro_orm_migrations',
          glob: '!(*.d).{js,ts,cjs}',
          silent: false,
          transactional: true,
          disableForeignKeys: false,
          allOrNothing: true,
          dropTables: true,
          safe: false,
          snapshot: true,
          emit: 'ts',
          generator: TSMigrationGenerator,
          fileName: (timestamp: string, name?: string) =>
            `Migration${timestamp}${name ? '_' + name : ''}`,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
