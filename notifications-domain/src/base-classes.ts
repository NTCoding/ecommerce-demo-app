/**
 * Base classes for the Notifications domain.
 *
 * These demonstrate how to use base class-based detection
 * that is mapped in the extraction config.
 */

/**
 * Base class for notification use cases.
 */
export abstract class BaseNotificationUseCase {
  abstract apply(...args: unknown[]): void | Promise<void>
}

/**
 * Base class for notification event handlers.
 */
export abstract class BaseNotificationHandler<TEvent> {
  abstract handle(event: TEvent): void | Promise<void>
}

/**
 * Base class for notification domain operations.
 */
export abstract class BaseNotificationDomainOp {}
