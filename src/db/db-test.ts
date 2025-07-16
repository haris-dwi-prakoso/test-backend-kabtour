import { Transaction } from "../transaction/entities/transaction.entity";
import { Provider } from '@nestjs/common';
import { TypeOrmModuleOptions, getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { v4 } from 'uuid';

const entities: EntityClassOrSchema[] = [Transaction]

export class TestingDb {
    private db: IMemoryDb;
    private dataSource: DataSource;

    private readonly typeormConfig: TypeOrmModuleOptions = {
        type: 'postgres',
        entities,
        namingStrategy: new SnakeNamingStrategy()
    }

    public constructor() {
        this.db = newDb({ autoCreateForeignKeyIndices: true })

        this.db.public.registerFunction({
            implementation: () => 'test',
            name: 'current_database'
        })

        this.db.public.registerFunction({
            implementation: () => 'test',
            name: 'version'
        })

        this.db.registerExtension('uuid-ossp', (schema) => {
            schema.registerFunction({
                name: 'uuid_generate_v4',
                returns: DataType.uuid,
                implementation: v4,
                impure: true
            })
        })

        this.db.public.registerFunction({
            name: 'exists',
            implementation: (...args: unknown[]) => {
                return args.length > 0
            },
            returns: DataType.bool,
            argsVariadic: DataType.integer
        })
    }

    public async initialize(): Promise<{
        db: IMemoryDb
        databaseProviders: Provider[]
        datasource: DataSource
    }> {
        this.dataSource = await this.db.adapters.createTypeormDataSource(this.typeormConfig)
        await this.dataSource.initialize()
        await this.dataSource.synchronize()

        const databaseProviders = [
            {
                provide: DataSource,
                useValue: this.dataSource
            },
            ...entities.map((entity) => ({
                provide: getRepositoryToken(entity),
                useValue: this.dataSource.getRepository(entity)
            }))
        ]

        return {
            databaseProviders,
            db: this.db,
            datasource: this.dataSource
        }
    }
}