import type { Request, Response } from 'express';
import { InventoryItem } from '../../domain/InventoryItem';
import { CheckStockUseCase } from './use-cases/check-stock-use-case';
export declare function checkStockEndpoint(useCase: CheckStockUseCase, inventoryItems: Map<string, InventoryItem>): (req: Request, res: Response) => void;
//# sourceMappingURL=endpoint.d.ts.map