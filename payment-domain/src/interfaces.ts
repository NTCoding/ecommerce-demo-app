/**
 * Interfaces for the Payment domain.
 *
 * These demonstrate how to use interface-based detection
 * that is mapped in the extraction config.
 */

/**
 * Marker interface for payment use cases.
 */
export interface IPaymentUseCase {
  apply(...args: unknown[]): unknown
}

/**
 * Marker interface for payment event handlers.
 */
export interface IPaymentEventHandler {
  handle(event: unknown): void | Promise<void>
}

/**
 * Marker interface for payment domain operations.
 */
export interface IPaymentDomainOp {}

/**
 * Marker interface for payment domain events.
 */
export interface IPaymentEvent {
  readonly type: string
}

/**
 * Marker interface for payment event publishers.
 */
export interface IPaymentEventPublisher {}
