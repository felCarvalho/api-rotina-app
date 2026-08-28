import { Migration } from '@mikro-orm/migrations';

export class Migration20260807204049 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "refresh_token" ("id" varchar(255) not null default uuidv7(), "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "user_id" varchar(255) not null, "status" text not null, "refresh_hash" varchar(255) not null, primary key ("id"));`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id");`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_status_check" check ("status" in ('ativo', 'inativo'));`);

    this.addSql(`drop table if exists "base" cascade;`);

    this.addSql(`alter table "permissions" alter column "created_at" set default now();`);
    this.addSql(`alter table "permissions" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "permissions" alter column "id" set default uuidv7();`);
    this.addSql(`alter table "permissions" alter column "updated_at" set default now();`);

    this.addSql(`alter table "role" alter column "created_at" set default now();`);
    this.addSql(`alter table "role" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "role" alter column "id" set default uuidv7();`);
    this.addSql(`alter table "role" alter column "updated_at" set default now();`);

    this.addSql(`alter table "user" alter column "created_at" set default now();`);
    this.addSql(`alter table "user" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "user" alter column "id" set default uuidv7();`);
    this.addSql(`alter table "user" alter column "updated_at" set default now();`);

    this.addSql(`alter table "pass_hash" alter column "deleted_at" drop not null;`);

    this.addSql(`alter table "credentials" alter column "created_at" set default now();`);
    this.addSql(`alter table "credentials" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "credentials" alter column "id" set default uuidv7();`);
    this.addSql(`alter table "credentials" alter column "updated_at" set default now();`);

    this.addSql(`alter table "category" alter column "created_at" set default now();`);
    this.addSql(`alter table "category" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "category" alter column "id" set default uuidv7();`);
    this.addSql(`alter table "category" alter column "updated_at" set default now();`);

    this.addSql(`alter table "task" alter column "created_at" set default now();`);
    this.addSql(`alter table "task" alter column "deleted_at" drop not null;`);
    this.addSql(`alter table "task" alter column "id" set default uuidv7();`);
    this.addSql(`alter table "task" alter column "updated_at" set default now();`);
  }

  override down(): void | Promise<void> {
    this.addSql(`create table "base" ("created_at" timestamptz(6) not null, "deleted_at" timestamptz(6) not null, "id" varchar(255) not null, "updated_at" timestamptz(6) not null, primary key ("id"));`);

    this.addSql(`drop table if exists "refresh_token" cascade;`);

    this.addSql(`alter table "category" alter column "id" drop default;`);
    this.addSql(`alter table "category" alter column "created_at" drop default;`);
    this.addSql(`alter table "category" alter column "updated_at" drop default;`);
    this.addSql(`alter table "category" alter column "deleted_at" set not null;`);

    this.addSql(`alter table "credentials" alter column "id" drop default;`);
    this.addSql(`alter table "credentials" alter column "created_at" drop default;`);
    this.addSql(`alter table "credentials" alter column "updated_at" drop default;`);
    this.addSql(`alter table "credentials" alter column "deleted_at" set not null;`);

    this.addSql(`alter table "pass_hash" alter column "deleted_at" set not null;`);

    this.addSql(`alter table "permissions" alter column "id" drop default;`);
    this.addSql(`alter table "permissions" alter column "created_at" drop default;`);
    this.addSql(`alter table "permissions" alter column "updated_at" drop default;`);
    this.addSql(`alter table "permissions" alter column "deleted_at" set not null;`);

    this.addSql(`alter table "role" alter column "id" drop default;`);
    this.addSql(`alter table "role" alter column "created_at" drop default;`);
    this.addSql(`alter table "role" alter column "updated_at" drop default;`);
    this.addSql(`alter table "role" alter column "deleted_at" set not null;`);

    this.addSql(`alter table "task" alter column "id" drop default;`);
    this.addSql(`alter table "task" alter column "created_at" drop default;`);
    this.addSql(`alter table "task" alter column "updated_at" drop default;`);
    this.addSql(`alter table "task" alter column "deleted_at" set not null;`);

    this.addSql(`alter table "user" alter column "id" drop default;`);
    this.addSql(`alter table "user" alter column "created_at" drop default;`);
    this.addSql(`alter table "user" alter column "updated_at" drop default;`);
    this.addSql(`alter table "user" alter column "deleted_at" set not null;`);
  }

}
