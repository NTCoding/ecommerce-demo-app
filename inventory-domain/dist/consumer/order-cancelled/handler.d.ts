import { InventoryItem } from '../../domain/InventoryItem';
import type { OrderCancelled } from '../../infrastructure/events';
import { ReleaseInventoryUseCase } from './use-cases/release-inventory-use-case';
export declare function handleOrderCancelled(event: OrderCancelled, useCase: ReleaseInventoryUseCase, inventoryItems: Map<string, InventoryItem>): void;
//# sourceMappingURL=handler.d.ts.map