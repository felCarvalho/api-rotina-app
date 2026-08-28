import { Module } from '@nestjs/common';
import { UnitOfWork } from '../uniOfWork/unitOfWork';
import { UnitOfWorkAbstract } from '../uniOfWork/unitOfWork';
import { Memory, MemoryAbstract } from '../redis/redis';

@Module({
  providers: [
    {
      provide: UnitOfWorkAbstract,
      useClass: UnitOfWork,
    },
    {
      provide: MemoryAbstract,
      useClass: Memory,
    },
  ],
  exports: [UnitOfWorkAbstract, MemoryAbstract],
})
export class ModuleCore {}
