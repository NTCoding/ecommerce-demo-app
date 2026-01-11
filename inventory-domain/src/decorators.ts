/**
 * Custom decorators for the Inventory domain.
 *
 * These demonstrate how to use locally-defined decorators
 * that are mapped in the extraction config.
 */

type Constructor = new (...args: unknown[]) => object

/**
 * Marks a class as an inventory use case.
 */
export function StockUseCase<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}

/**
 * Marks a class as ignored from architectural analysis.
 */
export function StockIgnore<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}
