import { APIContainer } from '@living-architecture/riviere-extract-conventions'
import type { Request, Response } from 'express'
import { PlaceOrderUseCase } from './use-cases/place-order-use-case'

@APIContainer
export class PlaceOrderEndpoint {
  constructor(private readonly useCase: PlaceOrderUseCase) {}

  handle(req: Request, res: Response): void {
    const { customerId, items, totalAmount } = req.body

    const order = this.useCase.apply({
      customerId,
      items,
      totalAmount
    })

    res.status(201).json({
      orderId: order.id,
      state: order.getState(),
      customerId: order.customerId,
      items: order.items
    })
  }
}

export function placeOrderEndpoint(useCase: PlaceOrderUseCase) {
  const endpoint = new PlaceOrderEndpoint(useCase)
  return (req: Request, res: Response) => endpoint.handle(req, res)
}
