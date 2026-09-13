import { Migration } from '@mikro-orm/migrations';

export class Migration20260908201437 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "refresh_token" alter column "id" drop default;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "refresh_token" alter column "id" set default uuidv7();`);
  }

}
