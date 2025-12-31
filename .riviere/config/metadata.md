# Codebase Analysis

## Structure
- Root: `/Users/nicktune/code/ecommerce-demo-app`
- Source code: `[domain]/src/` for each domain service, `bff/src/`, `ui/src/`
- Tests: None found

## Domains

- **orders-domain** (type: domain) — Core order management: placement, confirmation, cancellation, state transitions
- **inventory-domain** (type: domain) — Stock management: checking, reservation, allocation
- **shipping-domain** (type: domain) — Shipment lifecycle: creation, dispatch, tracking updates
- **payment-domain** (type: domain) — Payment processing: authorization, completion
- **notifications-domain** (type: domain) — Notification dispatch for order and shipment events
- **bff** (type: bff) — Backend-for-frontend aggregating orders and inventory services
- **ui** (type: ui) — React frontend for order placement

## Module Inference

How to derive module from file path:
- Rule: Top-level folder name before `/src/`
- Example: `orders-domain/src/api/place-order/endpoint.ts` → domain: orders-domain, module: api/place-order

## Frameworks
| Category | Name | Version |
|----------|------|---------|
| Runtime | Node.js | ES2022 target |
| Language | TypeScript | 5.3.3 |
| Web framework | Express.js | 4.18.2 |
| Frontend | React | 18.2.0 |
| Build (frontend) | Vite | 5.0.8 |
| Event/messaging | EventEmitter (in-process) | Node.js built-in |
| Database | None (in-memory) | — |

## Conventions
- File naming: kebab-case (`place-order/`, `cancel-order/`)
- Class naming: PascalCase (`PlaceOrderUseCase`, `Order`, `InventoryItem`)
- API pattern: `src/api/[action]/endpoint.ts` with route handler
- Use case pattern: `src/api/[action]/use-cases/[UseCase].ts` — class with `apply()` method
- Entity pattern: `src/domain/[Entity].ts` — class with state enum and transition methods
- Event pattern: `src/infrastructure/events.ts` — type unions (`OrderPlaced`, `PaymentCompleted`)
- Handler pattern: `src/consumer/[event-name]/handler.ts` — `handle[EventName]` functions

## Entry Points
| Type | Location | Pattern |
|------|----------|---------|
| API routes | `[domain]/src/server.ts` | Express app with `app.[method]()` |
| Event handlers | `[domain]/src/consumer/[event]/handler.ts` | `eventBus.on('[EventType]', handler)` |
| UI pages | `ui/src/pages/` | React components |
| Background jobs | `shipping-domain/src/jobs/update-tracking/cron.ts` | Cron via `setInterval` |

## Service Ports
| Service | Port |
|---------|------|
| orders-domain | 3000 |
| inventory-domain | 3001 |
| shipping-domain | 3002 |
| payment-domain | 3003 |
| notifications-domain | 3004 |
| bff | 3100 |
| ui (Vite dev) | 5173 |

## Event Flow

```
UI → BFF → Orders Domain
            ├─ publishes: OrderPlaced
            └─ subscribes: InventoryReserved, PaymentCompleted, ShipmentDelivered

OrderPlaced →
├─ Inventory Domain → publishes: InventoryReserved
├─ Payment Domain → publishes: PaymentCompleted/PaymentFailed
└─ Notifications Domain (sends notification)

InventoryReserved + PaymentCompleted → Orders confirms → publishes: OrderConfirmed
OrderConfirmed → Shipping Domain → publishes: ShipmentCreated
ShipmentDispatched/ShipmentDelivered → Notifications Domain
```

## Notes
- Microservices architecture with event-driven communication
- All domains follow hexagonal architecture: domain/, api/, consumer/, infrastructure/
- In-process EventEmitter used (demo app, not production messaging)
- No tests present
- No custom CLAUDE.md or documentation beyond minimal README
