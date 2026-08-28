import { Migration } from '@mikro-orm/migrations';

export class Migration20260806215517 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "base" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "permissions" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "slug" varchar(255) not null, "name" varchar(255) not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "permissions" add constraint "permissions_slug_unique" unique ("slug");`,
    );

    this.addSql(
      `create table "role" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "slug" varchar(255) not null, "name" varchar(255) not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "role" add constraint "role_slug_unique" unique ("slug");`,
    );

    this.addSql(
      `create table "role_permissions" ("role_id" varchar(255) not null, "permission_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, primary key ("role_id", "permission_id"));`,
    );

    this.addSql(
      `create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "name" varchar(255) not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "pass_hash" ("user_id" varchar(255) not null, "hash" varchar(255) not null, "created_at" timestamptz not null, "deleted_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("user_id"));`,
    );

    this.addSql(
      `create table "credentials" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "user_id" varchar(255) not null, "identifier" varchar(255) not null, "provider" varchar(255) not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "category" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "title" varchar(255) not null, "description" varchar(255) not null, "user_id" varchar(255) not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "category" add constraint "category_title_unique" unique ("title");`,
    );

    this.addSql(
      `create table "task" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "title" varchar(255) not null, "description" varchar(255) not null, "status" text not null, "category_id" varchar(255) not null, "user_id" varchar(255) not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "task" add constraint "task_title_unique" unique ("title");`,
    );

    this.addSql(
      `create table "user_roles" ("role_id" varchar(255) not null, "user_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, primary key ("role_id", "user_id"));`,
    );

    this.addSql(
      `alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permissions" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "pass_hash" add constraint "pass_hash_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "credentials" add constraint "credentials_user_id_foreign" foreign key ("user_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "category" add constraint "category_user_id_foreign" foreign key ("user_id") references "user" ("id");`,
    );

    this.addSql(
      `alter table "task" add constraint "task_category_id_foreign" foreign key ("category_id") references "category" ("id");`,
    );
    this.addSql(
      `alter table "task" add constraint "task_user_id_foreign" foreign key ("user_id") references "user" ("id");`,
    );
    this.addSql(
      `alter table "task" add constraint "task_status_check" check ("status" in ('concluida, incompleta'));`,
    );

    this.addSql(
      `alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "role_permissions" drop constraint "role_permissions_permission_id_foreign";`,
    );
    this.addSql(
      `alter table "role_permissions" drop constraint "role_permissions_role_id_foreign";`,
    );
    this.addSql(
      `alter table "user_roles" drop constraint "user_roles_role_id_foreign";`,
    );
    this.addSql(
      `alter table "pass_hash" drop constraint "pass_hash_user_id_foreign";`,
    );
    this.addSql(
      `alter table "credentials" drop constraint "credentials_user_id_foreign";`,
    );
    this.addSql(
      `alter table "category" drop constraint "category_user_id_foreign";`,
    );
    this.addSql(`alter table "task" drop constraint "task_user_id_foreign";`);
    this.addSql(
      `alter table "user_roles" drop constraint "user_roles_user_id_foreign";`,
    );
    this.addSql(
      `alter table "task" drop constraint "task_category_id_foreign";`,
    );

    this.addSql(`drop table if exists "base" cascade;`);
    this.addSql(`drop table if exists "permissions" cascade;`);
    this.addSql(`drop table if exists "role" cascade;`);
    this.addSql(`drop table if exists "role_permissions" cascade;`);
    this.addSql(`drop table if exists "user" cascade;`);
    this.addSql(`drop table if exists "pass_hash" cascade;`);
    this.addSql(`drop table if exists "credentials" cascade;`);
    this.addSql(`drop table if exists "category" cascade;`);
    this.addSql(`drop table if exists "task" cascade;`);
    this.addSql(`drop table if exists "user_roles" cascade;`);
  }
}
