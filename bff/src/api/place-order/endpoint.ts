import type { Request, Response } from 'express'
import { PlaceOrderBFFUseCase } from './usecase'

export function placeOrderBFFEndpoint(useCase: PlaceOrderBFFUseCase) {
  return async (req: Request, res: Response): Promise<void> => {
    const { customerId, items, totalAmount } = req.body

    const result = await useCase.apply({
      customerId,
      items,
      totalAmount
    })

    res.status(201).json(result)
  }
}
