import { Migration } from '@mikro-orm/migrations';

export class Migration20260831150228 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "category" alter column "description" drop not null;`);

    this.addSql(`alter table "task" alter column "description" drop not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "category" alter column "description" set not null;`);

    this.addSql(`alter table "task" alter column "description" set not null;`);
  }

}
