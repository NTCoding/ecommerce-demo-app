/**
 * Custom decorators for the Inventory domain.
 *
 * These demonstrate how to use locally-defined decorators
 * that are mapped in the extraction config.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => any

/**
 * Marks a class as an inventory use case.
 */
export function StockUseCase<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}

/**
 * Marks a class as an inventory event handler.
 */
export function StockHandler<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}

/**
 * Marks a class as an inventory domain operation container.
 */
export function StockOp<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}

/**
 * Marks a class as an inventory API endpoint.
 */
export function StockAPI<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}

/**
 * Marks a class as an inventory domain event.
 */
export function StockEvent<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}

/**
 * Marks a class as ignored from architectural analysis.
 */
export function StockIgnore<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}
