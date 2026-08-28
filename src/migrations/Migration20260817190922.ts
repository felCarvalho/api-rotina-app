import { Migration } from '@mikro-orm/migrations';

export class Migration20260817190922 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_id_foreign";`);
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_id_foreign";`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_role_id_foreign";`);

    this.addSql(`alter table "permissions" drop constraint "permissions_slug_unique";`);
    this.addSql(`alter table "permissions" drop constraint "permissions_pkey";`);
    this.addSql(`alter table "permissions" drop column "id";`);
    this.addSql(`alter table "permissions" alter column "created_at" drop default;`);
    this.addSql(`alter table "permissions" alter column "updated_at" drop default;`);
    this.addSql(`alter table "permissions" add primary key ("slug");`);

    this.addSql(`alter table "role" drop constraint "role_slug_unique";`);
    this.addSql(`alter table "role" drop constraint "role_pkey";`);
    this.addSql(`alter table "role" drop column "id";`);
    this.addSql(`alter table "role" alter column "created_at" drop default;`);
    this.addSql(`alter table "role" alter column "updated_at" drop default;`);
    this.addSql(`alter table "role" add primary key ("slug");`);

    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_pkey";`);
    this.addSql(`alter table "role_permissions" drop column "permission_id", drop column "role_id";`);
    this.addSql(`alter table "role_permissions" add "role_slug" varchar(255) not null, add "permission_slug" varchar(255) not null;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_slug_foreign" foreign key ("role_slug") references "role" ("slug") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_slug_foreign" foreign key ("permission_slug") references "permissions" ("slug") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "role_permissions" add primary key ("role_slug", "permission_slug");`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_pkey";`);
    this.addSql(`alter table "user_roles" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "user_roles" rename column "role_id" to "role_slug";`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_role_slug_foreign" foreign key ("role_slug") references "role" ("slug") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_roles" add primary key ("role_slug", "user_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_slug_foreign";`);
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_slug_foreign";`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_role_slug_foreign";`);

    this.addSql(`alter table "permissions" drop constraint "permissions_pkey";`);
    this.addSql(`alter table "permissions" add "id" varchar(255) not null default uuidv7();`);
    this.addSql(`alter table "permissions" alter column "created_at" set default now();`);
    this.addSql(`alter table "permissions" alter column "updated_at" set default now();`);
    this.addSql(`alter table "permissions" add constraint "permissions_slug_unique" unique ("slug");`);
    this.addSql(`alter table "permissions" add primary key ("id");`);

    this.addSql(`alter table "role" drop constraint "role_pkey";`);
    this.addSql(`alter table "role" add "id" varchar(255) not null default uuidv7();`);
    this.addSql(`alter table "role" alter column "created_at" set default now();`);
    this.addSql(`alter table "role" alter column "updated_at" set default now();`);
    this.addSql(`alter table "role" add constraint "role_slug_unique" unique ("slug");`);
    this.addSql(`alter table "role" add primary key ("id");`);

    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_pkey";`);
    this.addSql(`alter table "role_permissions" drop column "role_slug", drop column "permission_slug";`);
    this.addSql(`alter table "role_permissions" add "permission_id" varchar(255) not null, add "role_id" varchar(255) not null;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" alter column "deleted_at" set not null;`);
    this.addSql(`alter table "role_permissions" add primary key ("role_id", "permission_id");`);

    this.addSql(`alter table "user_roles" drop constraint "user_roles_pkey";`);
    this.addSql(`alter table "user_roles" alter column "deleted_at" set not null;`);
    this.addSql(`alter table "user_roles" rename column "role_slug" to "role_id";`);
    this.addSql(`alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_roles" add primary key ("role_id", "user_id");`);
  }

}
