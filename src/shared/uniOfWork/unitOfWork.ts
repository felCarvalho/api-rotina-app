import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

export abstract class UnitOfWorkAbstract {
  abstract commit(): Promise<void>;
  abstract rollback(): Promise<void>;
  abstract state(entity: Record<string, any> | Record<string, any>[]): void;
  abstract save(): Promise<void>;
  abstract transaction(
    clb: (em: EntityManager) => Promise<unknown>,
  ): Promise<unknown>;
}

@Injectable()
export class UnitOfWork implements UnitOfWorkAbstract {
  constructor(private readonly em: EntityManager) {}

  async commit() {
    await this.em.commit();
  }

  async save() {
    await this.em.flush();
  }

  state(entity: Record<string, any> | Record<string, any>[]) {
    return this.em.persist(entity);
  }

  async rollback() {
    await this.em.rollback();
  }

  async transaction(
    clb: (em: EntityManager) => Promise<unknown>,
  ): Promise<unknown> {
    return await this.em.transactional(clb);
  }
}
