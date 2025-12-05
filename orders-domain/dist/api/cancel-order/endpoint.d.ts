import type { Request, Response } from 'express';
import { CancelOrderUseCase } from './use-cases/cancel-order-use-case';
export declare function cancelOrderEndpoint(useCase: CancelOrderUseCase): (req: Request, res: Response) => void;
//# sourceMappingURL=endpoint.d.ts.map