import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "./db.service";
import { Pool } from "pg";
import e from "express";

jest.mock('pg', () => {
    const mockPool = {
      query: jest.fn(),
      end: jest.fn().mockResolvedValue(undefined),
    };
    return { Pool: jest.fn(() => mockPool) };
  });

describe('DatabaseService', () => {
    let service: DatabaseService;
    let mockPool: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [DatabaseService],
        }).compile();
    
        service = module.get<DatabaseService>(DatabaseService);
        mockPool = (service as any).pool;
      });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('query', () => {
        it('should call pool.query', async () => {
            const query = 'SELECT * FROM movies';
            await service.query(query, []);
            expect(mockPool.query).toHaveBeenCalledWith(query, []);
        });

        it('should return rows', async () => {
            const query = 'SELECT * FROM movies';
            const rows = [{id: 1, title: 'Interstellar'}];
            mockPool.query.mockResolvedValue({rows});
            const result = await service.query(query, []);
            expect(result).toEqual({rows});
        });

        it('should return error', async () => {
            const query = 'INVALID SQL';
            const error = new Error('error');
            mockPool.query.mockRejectedValue(error);
            await expect(service.query(query, [])).rejects.toThrow(error);
        });
    });

    describe('initialization and termination', () => {
        it('should initialize schema', async () => {
            mockPool.query.mockResolvedValue({rows: []});
            await service.onModuleInit();

            expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('CREATE EXTENSION IF NOT EXISTS btree_gist'));
            expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS'));
            expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('CREATE INDEX IF NOT EXISTS'));
        });

        it('should terminate pool', async () => {
            await service.onModuleDestroy();
            expect(mockPool.end).toHaveBeenCalled();
        });
    });
});