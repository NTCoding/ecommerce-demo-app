import type { Request, Response } from 'express'
import { PlaceOrderUseCase } from './use-cases/place-order-use-case'

export function placeOrderEndpoint(useCase: PlaceOrderUseCase) {
  return (req: Request, res: Response): void => {
    const { customerId, items, totalAmount } = req.body

    const order = useCase.apply({
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
