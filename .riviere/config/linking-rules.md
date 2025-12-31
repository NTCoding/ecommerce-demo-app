# Linking Rules

## HTTP Clients

| Client Pattern | Target Domain | Internal/External |
|----------------|---------------|-------------------|
| `ordersApi` | orders-domain | internal |
| `inventoryClient` | inventory-domain | internal |
| `paymentClient` | payment-domain | internal |
| `shippingClient` | shipping-domain | internal |

**Common patterns to scan:**
- Generated OpenAPI clients in `bff/src/generated/`
- `fetch(` calls with service URLs
- `axios.create(` instances

---

## Event Subscriptions

**Indicator:** `subscribeToEvent<EventType>('EventType', handler)` or `eventBus.on('EventType', handler)`

**From:** EventHandler

**To:** Event (by event type string)

### Example

```typescript
// Links EventHandler to Event it subscribes to
subscribeToEvent<OrderPlaced>('OrderPlaced', handleOrderPlaced)
// Creates link: handleOrderPlaced → OrderPlaced
```

---

## Event Publishing

**Indicator:** `publishEvent(event)` or `eventBus.emit('EventType', event)`

**From:** UseCase or DomainOp

**To:** Event (by event type in payload)

### Example

```typescript
// Links UseCase to Event it publishes
publishEvent({ type: 'OrderPlaced', orderId, items })
// Creates link: PlaceOrderUseCase → OrderPlaced
```

---

## UseCase to DomainOp

**Indicator:** Method calls on domain entity instances within UseCase.apply()

**From:** UseCase

**To:** DomainOp

### Example

```typescript
// PlaceOrderUseCase calls Order.begin()
const order = new Order()
order.begin()  // Creates link: PlaceOrderUseCase → Order.begin
```

---

## API to UseCase

**Indicator:** UseCase injection in endpoint factory or direct invocation

**From:** API

**To:** UseCase

### Example

```typescript
// Links API endpoint to its UseCase
app.post('/orders', endpoint(placeOrderUseCase))
// Creates link: POST /orders → PlaceOrderUseCase
```

---

## EventHandler to UseCase

**Indicator:** UseCase parameter or invocation within handler

**From:** EventHandler

**To:** UseCase

### Example

```typescript
export function handleOrderPlaced(event, useCase: ReserveInventoryUseCase) {
  useCase.apply(event)
}
// Creates link: handleOrderPlaced → ReserveInventoryUseCase
```

---

## BackgroundJob to UseCase

**Indicator:** UseCase invocation within scheduled function

**From:** BackgroundJob

**To:** UseCase

### Example

```typescript
setInterval(() => {
  updateTrackingUseCase.apply()
}, 300000)
// Creates link: update-tracking → UpdateTrackingUseCase
```

---

## UI to BFF API

**Indicator:** `fetch(` or API client calls in React components

**From:** UI

**To:** API (BFF endpoints)

### Example

```tsx
// OrderPage calls BFF
fetch('http://localhost:3100/bff/orders', { method: 'POST' })
// Creates link: OrderPage → POST /bff/orders
```

---

## Validation Rules

- **API** must link to at least one **UseCase**
- **EventHandler** must link to at least one **UseCase**
- **UseCase** should link to either **DomainOp** or **Event** (or both)
- **BFF API** must link to backend domain services (not just internal UseCase)
- **BackgroundJob** must link to a **UseCase**
- **UI** components with user interactions should link to **API** endpoints
