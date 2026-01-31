import type { APIControllerDef } from '@living-architecture/riviere-extract-conventions'
import type { Request, Response } from 'express'
import { PlaceOrderBFFUseCase } from './usecase'

/** @bffApi */
export class PlaceOrderBFFEndpoint implements APIControllerDef {
  readonly route = '/bff/orders'
  readonly method = 'POST'
  constructor(private readonly useCase: PlaceOrderBFFUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { customerId, items, totalAmount } = req.body

    const result = await this.useCase.apply({
      customerId,
      items,
      totalAmount
    })

    res.status(201).json(result)
  }
}

export function placeOrderBFFEndpoint(useCase: PlaceOrderBFFUseCase) {
  const endpoint = new PlaceOrderBFFEndpoint(useCase)
  return async (req: Request, res: Response) => endpoint.handle(req, res)
}
