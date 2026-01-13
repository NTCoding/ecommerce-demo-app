import { APIContainer } from '@living-architecture/riviere-extract-conventions'
import type { Request, Response } from 'express'
import { Order } from '../../domain/Order'
import { CancelOrderUseCase } from './use-cases/cancel-order-use-case'

@APIContainer
export class CancelOrderEndpoint {
  constructor(private readonly useCase: CancelOrderUseCase) {}

  handle(req: Request, res: Response): void {
    const orderId = req.params['orderId']
    const { reason } = req.body

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' })
      return
    }

    const order = new Order(orderId, 'customer123', [])

    this.useCase.apply({ orderId, reason }, order)

    res.status(200).json({
      orderId,
      state: order.getState(),
      message: 'Order cancelled successfully'
    })
  }
}

export function cancelOrderEndpoint(useCase: CancelOrderUseCase) {
  const endpoint = new CancelOrderEndpoint(useCase)
  return (req: Request, res: Response) => endpoint.handle(req, res)
}
