import { MikroORM } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';

async function runMikroOrm() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const command = process.argv[2];
    const orm = app.get(MikroORM);

    switch (command) {
      case 'create':
        await orm.migrator.create();
        console.log('migration criada com sucesso');
        break;
      case 'up':
        await orm.migrator.up();
        console.log('migration atualizada com sucesso');
        break;
      case 'down':
        await orm.migrator.down();
        console.log('migration revertida com sucesso');
        break;
      case 'rollup':
        await orm.migrator.rollup();
        console.log(
          'migration foram acopladas em um unico arquivo com sucesso',
        );
        break;
      default:
        console.error(
          'Ops: os comandos aceitos  são apenas os de create, up, down e rollup',
        );
    }
  } finally {
    await app.close();
  }
}
runMikroOrm();
