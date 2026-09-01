import { Migration } from '@mikro-orm/migrations';

export class Migration20260831160257 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_status_check";`);
    this.addSql(`alter table "task" add constraint "task_status_check" check ("status" in ('concluida', 'incompleta'));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "task" drop constraint "task_status_check";`);
    this.addSql(`alter table "task" add constraint "task_status_check" check ("status" in ('concluida incompleta'));`);
  }

}
