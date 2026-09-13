import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Builder } from 'builder-pattern';
import { Role } from '../../authentication/entity/role.entity';
import { Permissions } from '../../authentication/entity/permissions.entity';
import { RolesPermissions } from '../../authentication/entity/rolesPermissions.entity';
import { Credentials } from '../../authentication/entity/credentials.entity';
import { PassHash } from '../../authentication/entity/passHash.entity';
import { UserRoles } from '../../authentication/entity/userRoles.entity';
import { User } from '../../user/user.entity';
import { RULES, PERMISSIONS } from '../../shared/roles-permissions/rules';
import { createUserData } from './data.seeders';

export async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const em = app.get(MikroORM);
    const command = process.argv[2];
    switch (command) {
      case 'roles_permissions': {
        const date = new Date();

        await RequestContext.create(em.em, async () => {
          for (const rules of Object.values(RULES)) {
            const findRole = await em.em.findOne(Role, {
              slug: rules,
            });

            if (findRole) {
              console.log('Rota já existe no db');
              continue;
            }

            const createRole = em.em.create(Role, {
              name: rules,
              slug: rules,
              createdAt: date,
              updatedAt: date,
            });

            em.em.persist(createRole);

            for (const perm of Object.values(PERMISSIONS)) {
              const findPermissions = await em.em.findOne(Permissions, {
                slug: perm,
              });

              if (findPermissions) {
                console.log('Essa permissão já existe');
                continue;
              }

              const createPermissions = em.em.create(Permissions, {
                slug: perm,
                name: perm,
                createdAt: date,
                updatedAt: date,
              });

              em.em.persist(createPermissions);

              const rolesPermissions = em.em.create(RolesPermissions, {
                role: createRole,
                permission: createPermissions,
              });

              em.em.persist(rolesPermissions);
            }
          }

          await em.em.flush();
        });
        break;
      }
      case 'user': {
        const date = new Date();

        await RequestContext.create(em.em, async () => {
          const createUser = em.em.create(User, {
            name: createUserData.name,
          });

          em.em.persist(createUser);

          const createCred = em.em.create(Credentials, {
            identifier: createUserData.identifier,
            provider: 'local',
            user: createUser,
          });

          em.em.persist(createCred);

          const createPassHash = em.em.create(PassHash, {
            hash: '$argon2id$v=19$m=65536,p=4,t=3$lHGKyBykFEc6jwGBbI7SkQ$DtGzcxQVDDEdbGhUv4Dx0VuvuUYnVz44jgQ/5NAQT64',
            user: createUser,
            updatedAt: date,
            createdAt: date,
          });

          em.em.persist(createPassHash);

          const findRole = await em.em.findOne(Role, {
            slug: RULES.user,
          });

          if (!findRole) {
            console.log('Opa, erro ao buscar role no db');
          }

          const createUserRoles = em.em.create(UserRoles, {
            role: findRole,
            user: createUser,
          });

          em.em.persist(createUserRoles);

          await em.em.flush();
        });
        break;
      }
    }
  } catch (e) {
    console.error(e);
  }

  await app.close();
  console.log('Seeder aplica com sucesso');
}

seed();
