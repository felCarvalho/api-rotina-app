import { Migration } from '@mikro-orm/migrations';

export class Migration20260817192310 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_slug_foreign";`);
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_slug_foreign";`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_role_slug_foreign";`);
    this.addSql(`alter table "user_roles" drop constraint "user_roles_user_id_foreign";`);

    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_pkey";`);
    this.addSql(`alter table "role_permissions" add "id" varchar(255) not null default uuidv7();`);
    this.addSql(`alter table "role_permissions" alter column "created_at" set default now();`);
    this.addSql(`alter table "role_permissions" alter column "updated_at" set default now();`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_slug_foreign" foreign key ("permission_slug") references "permissions" ("slug");`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_slug_foreign" foreign key ("role_slug") references "role" ("slug");`);
    this.addSql(`alter table "role_permissions" add primary key ("id");`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_pkey";`);
    this.addSql(`alter table "user_roles" add "id" varchar(255) not null default uuidv7();`);
    this.addSql(`alter table "user_roles" alter column "created_at" set default now();`);
    this.addSql(`alter table "user_roles" alter column "updated_at" set default now();`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_role_slug_foreign" foreign key ("role_slug") references "role" ("slug");`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id");`);
    this.addSql(`alter table "user_roles" add primary key ("id", "role_slug", "user_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_slug_foreign";`);
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_slug_foreign";`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_role_slug_foreign";`);
    this.addSql(`alter table "user_roles" drop constraint "user_roles_user_id_foreign";`);

    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_pkey";`);
    this.addSql(`alter table "role_permissions" drop column "id";`);
    this.addSql(`alter table "role_permissions" alter column "created_at" drop default;`);
    this.addSql(`alter table "role_permissions" alter column "updated_at" drop default;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_slug_foreign" foreign key ("role_slug") references "role" ("slug") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_slug_foreign" foreign key ("permission_slug") references "permissions" ("slug") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add primary key ("role_slug", "permission_slug");`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_pkey";`);
    this.addSql(`alter table "user_roles" drop column "id";`);
    this.addSql(`alter table "user_roles" alter column "created_at" drop default;`);
    this.addSql(`alter table "user_roles" alter column "updated_at" drop default;`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_role_slug_foreign" foreign key ("role_slug") references "role" ("slug") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_roles" add primary key ("role_slug", "user_id");`);
  }

}
