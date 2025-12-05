# E-Commerce Demo Application

TypeScript reference implementation demonstrating multi-domain event-driven architecture with entity state machines, domain-driven design patterns, and cross-domain event flows.

## Architecture Overview

This application implements a distributed e-commerce system across **6 independent domains**, each running as a separate service with its own domain model and state management.

### Domains

1. **UI** (`ui/`) - Customer-facing web interface
2. **BFF** (`bff/`) - Backend-for-frontend API gateway
3. **Orders Domain** (`orders-domain/`) - Order lifecycle management
4. **Inventory Domain** (`inventory-domain/`) - Stock management and reservation
5. **Payment Domain** (`payment-domain/`) - Payment processing
6. **Shipping Domain** (`shipping-domain/`) - Shipment creation and tracking
7. **Notifications Domain** (`notifications-domain/`) - Customer notifications

## Entity State Machines

### Order Entity

**States:** `Draft` → `Placed` → `InventoryReserved` → `PaymentCompleted` → `Confirmed` → `Shipped` → `Delivered` | `Cancelled`

**Operations:**
- `begin()`: Draft → Placed
- `markInventoryReserved()`: Placed → InventoryReserved
- `markPaymentCompleted()`: Placed → PaymentCompleted
- `confirm()`: InventoryReserved + PaymentCompleted → Confirmed
- `ship()`: Confirmed → Shipped
- `deliver()`: Shipped → Delivered
- `cancel()`: * → Cancelled

**Coordination:** Order requires both inventory reservation AND payment completion before confirmation (parallel prerequisites).

### Shipment Entity

**States:** `Pending` → `Created` → `Dispatched` → `InTransit` → `Delivered` | `Cancelled`

**Operations:**
- `create(trackingNumber)`: Pending → Created
- `dispatch()`: Created → Dispatched
- `markInTransit()`: Dispatched → InTransit
- `deliver()`: InTransit → Delivered
- `cancel()`: * → Cancelled

### InventoryItem Entity

**States:** `Available` → `Reserved` → `Allocated` → `Depleted`

**Operations:**
- `reserve(quantity)`: Available → Reserved (decrements availableQuantity)
- `allocate(quantity)`: Reserved → Allocated (moves from reserved to allocated)
- `release(quantity)`: Reserved → Available (cancellation flow)
- `replenish(quantity)`: * → Available
- `markDepleted()`: * → Depleted (when availableQuantity === 0)

### Payment Entity

**States:** `Pending` → `Authorized` → `Completed` | `Failed` | `Refunded`

**Operations:**
- `authorize()`: Pending → Authorized
- `complete()`: Authorized → Completed
- `fail()`: Pending → Failed
- `refund()`: Completed → Refunded

### Notification Entity

**Statuses:** `Pending` → `Sent` | `Failed`

**Operations:**
- `markSent()`: Pending → Sent
- `markFailed()`: Pending → Failed

## Cross-Domain Event Flows

### Happy Path: Complete Order Flow

```
1. UI → BFF POST /orders/place
   ↓
2. BFF → Orders Domain POST /orders
   ↓
3. Orders Domain: Order.begin()
   → Publishes: OrderPlaced event
   ↓
4a. Inventory Domain Handler: ReserveInventoryHandler
    → InventoryItem.reserve()
    → Publishes: InventoryReserved event
    ↓
5a. Orders Domain Handler: ConfirmOrderAfterInventoryUseCase
    → Order.markInventoryReserved()

4b. Payment Domain Handler: ProcessPaymentHandler
    → Payment.authorize()
    → Payment.complete()
    → Publishes: PaymentCompleted event
    ↓
5b. Orders Domain Handler: ConfirmOrderAfterPaymentUseCase
    → Order.markPaymentCompleted()
    ↓
6. Orders Domain: Order.confirm() (when both inventory + payment complete)
   → Publishes: OrderConfirmed event
   ↓
7. Shipping Domain Handler: CreateShipmentHandler
   → Shipment.create(trackingNumber)
   → Publishes: ShipmentCreated event
   ↓
8. Shipping Domain API: POST /shipments/:id/dispatch
   → Shipment.dispatch()
   → Publishes: ShipmentDispatched event
   ↓
9. Shipping Domain Job: UpdateTrackingUseCase (cron)
   → Shipment.markInTransit()
   → Shipment.deliver()
   → Publishes: ShipmentDelivered event
   ↓
10. Orders Domain Handler: CompleteOrderUseCase
    → Order.deliver()
```

### Cross-Domain Notifications

```
OrderPlaced → Notifications Domain → NotifyOrderPlacedUseCase
PaymentCompleted → Notifications Domain → NotifyPaymentCompletedUseCase
ShipmentDispatched → Notifications Domain → NotifyShipmentDispatchedUseCase
ShipmentDelivered → Notifications Domain → NotifyShipmentDeliveredUseCase
```

### Cancellation Flow

```
1. Orders Domain API: POST /orders/:id/cancel
   ↓
2. Orders Domain: Order.cancel()
   → Publishes: OrderCancelled event
   ↓
3. Inventory Domain Handler: ReleaseInventoryHandler
   → InventoryItem.release()
```

## Domain Boundaries

Each domain is autonomous with:

- **Independent deployment**: Separate Express servers on different ports
- **Own data model**: Domain entities encapsulate state transitions
- **Event-driven integration**: Domains communicate via events (EventEmitter simulation)
- **Use case layer**: Business logic orchestration
- **API layer**: REST endpoints for synchronous operations
- **Consumer layer**: Event handlers for asynchronous operations

### Domain Ports

- UI: 5173 (Vite dev server)
- BFF: 3000
- Orders Domain: 3001
- Inventory Domain: 3002
- Shipping Domain: 3003
- Payment Domain: 3005
- Notifications Domain: 3004

## File Organization

Each domain follows this structure:

```
domain-name/
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts                    # Express app, event subscriptions
│   ├── domain/
│   │   └── EntityName.ts            # Entity with state machine
│   ├── api/
│   │   └── operation-name/
│   │       ├── endpoint.ts          # Express route handler
│   │       └── use-cases/
│   │           └── operation-use-case.ts
│   ├── consumer/
│   │   └── event-name/
│   │       ├── handler.ts           # Event handler
│   │       └── use-cases/
│   │           └── handle-event-use-case.ts
│   ├── jobs/ (optional)
│   │   └── job-name/
│   │       ├── cron.ts
│   │       └── use-cases/
│   │           └── job-use-case.ts
│   └── infrastructure/
│       ├── events.ts                # Event types and pub/sub
│       └── external-client.ts       # External API clients (optional)
```

## Building and Running

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Install all domain dependencies
for domain in orders-domain inventory-domain shipping-domain payment-domain notifications-domain bff ui; do
  cd $domain && npm install && cd ..
done
```

### Type Checking

```bash
# Check all domains
cd orders-domain && npx tsc --noEmit
cd ../inventory-domain && npx tsc --noEmit
cd ../shipping-domain && npx tsc --noEmit
cd ../payment-domain && npx tsc --noEmit
cd ../notifications-domain && npx tsc --noEmit
cd ../bff && npx tsc --noEmit
```

### Running Services

```bash
# Terminal 1: Orders Domain
cd orders-domain && npm run dev

# Terminal 2: Inventory Domain
cd inventory-domain && npm run dev

# Terminal 3: Shipping Domain
cd shipping-domain && npm run dev

# Terminal 4: Payment Domain
cd payment-domain && npm run dev

# Terminal 5: Notifications Domain
cd notifications-domain && npm run dev

# Terminal 6: BFF
cd bff && npm run dev

# Terminal 7: UI
cd ui && npm run dev
```

## Key Patterns Demonstrated

### 1. Entity State Machines

Entities encapsulate state and enforce valid state transitions through operations.

**Example:**
```typescript
export class Order {
  private state: OrderState = OrderState.Draft

  begin(): void {
    this.state = OrderState.Placed
  }

  confirm(): void {
    this.state = OrderState.Confirmed
  }
}
```

### 2. Domain-Driven Use Cases

Business logic lives in use case classes, separate from infrastructure concerns.

**Example:**
```typescript
export class PlaceOrderUseCase {
  apply(customerId: string, items: OrderItem[]): Order {
    const order = new Order(generateId(), customerId, items)
    order.begin()
    publishEvent({ type: 'OrderPlaced', orderId: order.id, ... })
    return order
  }
}
```

### 3. Event-Driven Cross-Domain Communication

Domains remain loosely coupled through asynchronous events.

**Example:**
```typescript
// Publisher (Orders Domain)
publishEvent({ type: 'OrderPlaced', orderId, customerId, items, totalAmount })

// Subscriber (Inventory Domain)
subscribeToEvent('OrderPlaced', (event) => {
  const useCase = new ReserveInventoryUseCase()
  useCase.apply(event.orderId, event.items)
})
```

### 4. Parallel Prerequisites with Coordination

Order confirmation requires both inventory reservation AND payment completion (saga pattern).

**Implementation:**
```typescript
class Order {
  private inventoryReserved: boolean = false
  private paymentCompleted: boolean = false

  markInventoryReserved(): void {
    this.inventoryReserved = true
    this.checkCanConfirm()
  }

  markPaymentCompleted(): void {
    this.paymentCompleted = true
    this.checkCanConfirm()
  }

  private checkCanConfirm(): void {
    if (this.inventoryReserved && this.paymentCompleted) {
      this.confirm()
    }
  }
}
```

### 5. Discriminated Union Event Types

Type-safe event handling using TypeScript discriminated unions.

**Example:**
```typescript
export type ExternalEvent =
  | { type: 'OrderPlaced', orderId: string, ... }
  | { type: 'PaymentCompleted', paymentId: string, ... }
  | { type: 'ShipmentDispatched', shipmentId: string, ... }

// Type-safe subscription with overloads
export function subscribeToEvent(
  eventType: 'OrderPlaced',
  handler: (event: OrderPlaced) => void
): void
```

## Purpose

This demo application serves as the **reference implementation** for the Rivière architecture extraction tool. It demonstrates:

- Multi-domain distributed systems
- Complex cross-domain flows
- Entity state machines with rich state transitions
- Event-driven architecture patterns
- Domain-driven design principles

The Rivière extractor will parse this codebase to generate flow-based architecture graphs showing how operations flow through domains, state machines, and event handlers.
