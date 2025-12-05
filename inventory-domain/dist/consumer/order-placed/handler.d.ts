import { InventoryItem } from '../../domain/InventoryItem';
import type { OrderPlaced } from '../../infrastructure/events';
import { ReserveInventoryUseCase } from './use-cases/reserve-inventory-use-case';
export declare function handleOrderPlaced(event: OrderPlaced, useCase: ReserveInventoryUseCase, inventoryItems: Map<string, InventoryItem>): void;
//# sourceMappingURL=handler.d.ts.map