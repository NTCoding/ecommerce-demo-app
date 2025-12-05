import type { Request, Response } from 'express'
import { Order } from '../../domain/Order'
import { CancelOrderUseCase } from './use-cases/cancel-order-use-case'

export function cancelOrderEndpoint(useCase: CancelOrderUseCase) {
  return (req: Request, res: Response): void => {
    const orderId = req.params['orderId']
    const { reason } = req.body

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' })
      return
    }

    const order = new Order(orderId, 'customer123', [])

    useCase.apply({ orderId, reason }, order)

    res.status(200).json({
      orderId,
      state: order.getState(),
      message: 'Order cancelled successfully'
    })
  }
}
