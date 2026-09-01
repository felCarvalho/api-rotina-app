import { createClient, RedisClientType } from 'redis';
import { OnModuleInit, OnModuleDestroy, Injectable } from '@nestjs/common';
import { Result, type Err } from '../result-pattern/result';

export interface HSetAllTypes {
  key: string;
  value: Record<string, any>;
}

export interface HSetByTypes {
  key: string;
  field: string;
  value: string;
}

export interface XTypes {
  key: string;
  field: string;
}

export interface HExpTypes {
  key: string;
  field: string;
  seconds: number;
  mode?: 'NX' | 'XX' | 'GT' | 'LT';
}

export type HGetAll = { key: string };

export abstract class MemoryAbstract {
  abstract hSetAll({ key, value }: HSetAllTypes): Promise<number | Err<string>>;
  abstract hSetBy({
    key,
    field,
    value,
  }: HSetByTypes): Promise<number | Err<string>>;
  abstract hGetAll({ key }: HGetAll): Promise<
    | Err<string>
    | {
        [x: string]: string;
      }
  >;
  abstract hGetBy({ key, field }: XTypes): Promise<string | Err<string> | null>;
  abstract hDelBy({ key, field }: XTypes): Promise<number | Err<string>>;
  abstract hExp({
    key,
    field,
    seconds,
    mode,
  }: HExpTypes): Promise<Err<string> | number[]>;
}

@Injectable()
export class Memory implements OnModuleInit, OnModuleDestroy, MemoryAbstract {
  private client: RedisClientType = createClient({});

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });

    this.client.on('error', (err: unknown) =>
      console.log('Redis Client Error', err),
    );

    await this.client.connect();
  }

  async onModuleDestroy() {
    this.client.on('error', (err: unknown) =>
      console.log('Redis Client Error', err),
    );

    this.client.destroy();
  }

  public async hSetAll({ key, value }: HSetAllTypes) {
    try {
      return await this.client.hSet(key, value);
    } catch (e: any) {
      return Result.err('Ops, error:' + e);
    }
  }

  public async hSetBy({ key, field, value }: HSetByTypes) {
    try {
      return await this.client.hSet(key, field, value);
    } catch (e: any) {
      return Result.err(`Error: ${e}`);
    }
  }

  public async hGetAll({ key }: HGetAll) {
    try {
      return await this.client.hGetAll(key);
    } catch (e: any) {
      return Result.err(`Error: ${e}`);
    }
  }

  public async hGetBy({ key, field }: XTypes) {
    try {
      return await this.client.hGet(key, field);
    } catch (e: any) {
      return Result.err(`Error: ${e}`);
    }
  }

  public async hDelBy({ key, field }: XTypes) {
    try {
      return await this.client.hDel(key, field);
    } catch (e: any) {
      return Result.err(`Error: ${e}`);
    }
  }

  public async hExp({ key, field, seconds, mode }: HExpTypes) {
    try {
      return (await this.client.hExpire(key, field, seconds, mode)) as number[];
    } catch (e: any) {
      return Result.err(`Error: ${e}`);
    }
  }
}
