import type { Request, Response } from 'express'
import { Shipment } from '../../domain/Shipment'
import { DispatchShipmentUseCase } from './use-cases/dispatch-shipment-use-case'

/** @api */
export class DispatchShipmentEndpoint {
  readonly route = '/shipments/:shipmentId/dispatch'
  readonly method = 'POST'
  constructor(private readonly useCase: DispatchShipmentUseCase) {}

  handle(req: Request, res: Response): void {
    const shipmentId = req.params['shipmentId']

    if (!shipmentId) {
      res.status(400).json({ error: 'Shipment ID is required' })
      return
    }

    const shipment = new Shipment(
      shipmentId,
      'order123',
      '123 Main St',
      'TRK123'
    )

    this.useCase.apply(shipmentId, shipment)

    res.status(200).json({
      shipmentId,
      state: shipment.getState(),
      message: 'Shipment dispatched successfully'
    })
  }
}

export function dispatchShipmentEndpoint(useCase: DispatchShipmentUseCase) {
  const endpoint = new DispatchShipmentEndpoint(useCase)
  return (req: Request, res: Response) => endpoint.handle(req, res)
}
