import { IPaymentEventHandler } from '../../interfaces'
import type { OrderPlaced } from '../../infrastructure/events'
import { ProcessPaymentUseCase } from './use-cases/process-payment-use-case'

export class OrderPlacedHandler implements IPaymentEventHandler {
  readonly subscribedEvents = ['OrderPlaced']
  constructor(private readonly useCase: ProcessPaymentUseCase) {}

  handle(event: OrderPlaced): void {
    console.log(`[Payment] Handling OrderPlaced for order ${event.orderId}`)
    this.useCase.apply(event.orderId, event.totalAmount)
    console.log(`[Payment] Processing payment for order ${event.orderId}`)
  }
}

export function handleOrderPlaced(event: OrderPlaced, useCase: ProcessPaymentUseCase): void {
  const handler = new OrderPlacedHandler(useCase)
  handler.handle(event)
}
