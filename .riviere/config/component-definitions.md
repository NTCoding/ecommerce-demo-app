# Component Extraction Rules

## Proposed Custom Types

| Pattern | Suggested Name | Decision |
|---------|----------------|----------|
| Cron jobs in `src/jobs/` | `BackgroundJob` | Accepted |
| Infrastructure clients in `src/infrastructure/*-client.ts` | `ExternalClient` | Rejected - treat as infrastructure detail |

---

## UI

### Identification

**Location:** `ui/src/`

**Class pattern:** React functional components (`.tsx` files exporting components)

**Select:** Default or named component exports

### Fields

| Schema Field | Source in Code |
|--------------|----------------|
| name | Component name (e.g., `OrderPage`) |
| path | File path |

### Exclude

- Non-component files (`App.tsx`, `main.tsx`)
- Utility/helper files

### Example

```tsx
// ui/src/pages/OrderPage.tsx
export const OrderPage = () => {     // ✓ UI: OrderPage
  return <div>...</div>
}
```

---

## API

### Identification

**Location:** `src/api/`, `src/server.ts`

**Class pattern:** Express route handlers - `app.get()`, `app.post()`, `app.put()`, `app.delete()`

**Select:** Route registrations in server.ts

### Fields

| Schema Field | Source in Code |
|--------------|----------------|
| method | HTTP method (GET, POST, PUT, DELETE) |
| path | Route path string (e.g., `/orders`, `/orders/:orderId`) |
| name | Derived from path + method (e.g., `POST /orders`) |

### Exclude

- Middleware functions
- Error handlers

### Example

```typescript
// orders-domain/src/server.ts
app.post('/orders', endpoint(placeOrderUseCase))     // ✓ API: POST /orders
app.delete('/orders/:orderId', endpoint(cancelUseCase)) // ✓ API: DELETE /orders/:orderId

// bff/src/server.ts
app.post('/bff/orders', endpoint(placeOrderUseCase)) // ✓ API: POST /bff/orders
```

---

## UseCase

### Identification

**Location:** `src/`

**Class pattern:** Classes with `UseCase` suffix containing `apply()` method

**Select:** Class declaration

### Fields

| Schema Field | Source in Code |
|--------------|----------------|
| name | Class name (e.g., `PlaceOrderUseCase`) |
| path | File path |

### Exclude

- Abstract base classes
- Test mocks

### Example

```typescript
// orders-domain/src/api/place-order/use-cases/place-order-use-case.ts
export class PlaceOrderUseCase {         // ✓ UseCase: PlaceOrderUseCase
  apply(request: PlaceOrderRequest) {
    // ...
  }
}

// inventory-domain/src/consumer/order-placed/use-cases/reserve-inventory-use-case.ts
export class ReserveInventoryUseCase {   // ✓ UseCase: ReserveInventoryUseCase
  apply(event: OrderPlaced) { }
}
```

---

## DomainOp

### Identification

**Location:** `src/domain/`

**Class pattern:** Domain entity/aggregate classes (e.g., `Order`, `InventoryItem`, `Shipment`, `Payment`, `Notification`)

**Select:** Public methods that mutate state

### Fields

| Schema Field | Source in Code |
|--------------|----------------|
| entity | Containing class name |
| operation | Method name |

### Exclude

- Private methods
- Getters (`get*`, `is*`, `has*`)
- Static factory methods (`create*`, `hydrate*`)
- Constructor

### Example

```typescript
// orders-domain/src/domain/order.ts
export class Order {
  begin() { }                    // ✓ DomainOp: Order.begin
  reserveInventory() { }         // ✓ DomainOp: Order.reserveInventory
  completePayment() { }          // ✓ DomainOp: Order.completePayment
  confirm() { }                  // ✓ DomainOp: Order.confirm
  ship() { }                     // ✓ DomainOp: Order.ship
  deliver() { }                  // ✓ DomainOp: Order.deliver
  cancel() { }                   // ✓ DomainOp: Order.cancel
  getState() { }                 // ✗ getter
  private setState() { }         // ✗ private
}

// inventory-domain/src/domain/inventory-item.ts
export class InventoryItem {
  reserve(quantity: number) { }  // ✓ DomainOp: InventoryItem.reserve
  allocate() { }                 // ✓ DomainOp: InventoryItem.allocate
  release() { }                  // ✓ DomainOp: InventoryItem.release
  getAvailableQuantity() { }     // ✗ getter
}
```

---

## Event

### Identification

**Location:** `src/infrastructure/events.ts`

**Class pattern:** TypeScript type definitions with `type` discriminator field

**Select:** Individual event type definitions in type unions

### Fields

| Schema Field | Source in Code |
|--------------|----------------|
| name | Type name (e.g., `OrderPlaced`, `PaymentCompleted`) |
| payload | Type properties |

### Exclude

- Union type aliases (e.g., `type DomainEvent = ...`)
- Re-exports

### Example

```typescript
// orders-domain/src/infrastructure/events.ts
export type OrderPlaced = {              // ✓ Event: OrderPlaced
  type: 'OrderPlaced'
  orderId: string
  items: OrderItem[]
}

export type OrderConfirmed = {           // ✓ Event: OrderConfirmed
  type: 'OrderConfirmed'
  orderId: string
}

export type DomainEvent = OrderPlaced | OrderConfirmed  // ✗ union alias
```

---

## EventHandler

### Identification

**Location:** `src/consumer/`

**Class pattern:** `handler.ts` files with `handle*` functions or event subscriptions

**Select:** Handler function declarations

### Fields

| Schema Field | Source in Code |
|--------------|----------------|
| name | Function name or derived from event type |
| subscribesTo | Event type string from subscription |

### Exclude

- Helper functions
- Utility wrappers

### Example

```typescript
// inventory-domain/src/consumer/order-placed/handler.ts
export function handleOrderPlaced(       // ✓ EventHandler: handleOrderPlaced
  event: OrderPlaced,
  useCase: ReserveInventoryUseCase
) { }

// shipping-domain/src/consumer/order-confirmed/handler.ts
subscribeToEvent<OrderConfirmed>('OrderConfirmed', (event) =>
  handleOrderConfirmed(event, createShipmentUseCase)  // ✓ EventHandler: handleOrderConfirmed
)
```

---

## BackgroundJob (Custom)

### Identification

**Location:** `src/jobs/`

**Class pattern:** Files named `cron.ts` with `setInterval` or scheduling logic

**Select:** Job entry point (scheduled function)

### Fields

| Schema Field | Source in Code |
|--------------|----------------|
| name | Derived from folder name (e.g., `update-tracking`) |
| schedule | Interval value |

### Exclude

- Helper functions within job files
- Use cases invoked by jobs (captured as UseCase)

### Example

```typescript
// shipping-domain/src/jobs/update-tracking/cron.ts
setInterval(() => {                      // ✓ BackgroundJob: update-tracking
  updateTrackingUseCase.apply()
}, 300000)  // 5 minutes
```

