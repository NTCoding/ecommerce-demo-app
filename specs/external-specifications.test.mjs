import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { Parser, fromFile } from '@asyncapi/parser'
import eventCatalogSdk from '@eventcatalog/sdk'

const eventCatalog = eventCatalogSdk(fileURLToPath(new URL('./eventcatalog', import.meta.url)))
const asyncApiPath = fileURLToPath(new URL('./asyncapi.yaml', import.meta.url))

test('EventCatalog fixture exposes the five expected domains', async () => {
  const domains = await eventCatalog.getDomains()

  assert.deepEqual(
    domains.map(({ id, name }) => ({ id, name })).sort((left, right) => left.id.localeCompare(right.id)),
    [
      { id: 'InventoryDomain', name: 'Inventory' },
      { id: 'NotificationsDomain', name: 'Notifications' },
      { id: 'OrdersDomain', name: 'Orders' },
      { id: 'PaymentDomain', name: 'Payment' },
      { id: 'ShippingDomain', name: 'Shipping' },
    ],
  )
})

test('EventCatalog fixture exposes the exact order lifecycle events', async () => {
  const events = await eventCatalog.getEvents()

  assert.deepEqual(
    events
      .map(({ id, name, version }) => ({ id, name, version }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    [
      { id: 'OrderConfirmed', name: 'Order confirmed', version: '1.0.0' },
      { id: 'OrderCreated', name: 'Order created', version: '1.0.0' },
    ],
  )
})

test('EventCatalog fixture exposes the exact services and event directions', async () => {
  const services = await eventCatalog.getServices()

  assert.deepEqual(
    services
      .map(({ id, receives = [], sends = [] }) => ({
        id,
        receives: receives.map((event) => event.id),
        sends: sends.map((event) => event.id),
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    [
      { id: 'InventoryService', receives: ['OrderCreated'], sends: [] },
      { id: 'NotificationsService', receives: ['OrderCreated'], sends: [] },
      { id: 'OrdersService', receives: [], sends: ['OrderCreated', 'OrderConfirmed'] },
      { id: 'PaymentService', receives: ['OrderCreated'], sends: [] },
      { id: 'ShippingService', receives: ['OrderConfirmed'], sends: [] },
    ],
  )
})

test('EventCatalog fixture exposes the orders service as the order-created producer', async () => {
  const { producers } = await eventCatalog.getProducersAndConsumersForMessage('OrderCreated', '1.0.0')

  assert.deepEqual(producers.map(({ id }) => id), ['OrdersService'])
})

test('EventCatalog fixture exposes all downstream order-created consumers', async () => {
  const { consumers } = await eventCatalog.getProducersAndConsumersForMessage('OrderCreated', '1.0.0')

  assert.deepEqual(
    consumers.map(({ id }) => id).sort(),
    ['InventoryService', 'NotificationsService', 'PaymentService'],
  )
})

test('EventCatalog fixture exposes shipping as the order-confirmed consumer', async () => {
  const { consumers, producers } = await eventCatalog.getProducersAndConsumersForMessage('OrderConfirmed', '1.0.0')

  assert.deepEqual(producers.map(({ id }) => id), ['OrdersService'])
  assert.deepEqual(consumers.map(({ id }) => id), ['ShippingService'])
})

test('AsyncAPI fixture parses as version 3.0.0', async () => {
  const { document } = await fromFile(new Parser(), asyncApiPath).parse()

  assert.ok(document)
  assert.equal(document.version(), '3.0.0')
})

test('AsyncAPI fixture exposes the exact order lifecycle messages', async () => {
  const { document } = await fromFile(new Parser(), asyncApiPath).parse()

  assert.ok(document)
  assert.deepEqual(
    document.messages()
      .map((message) => ({ id: message.id(), name: message.name() }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    [
      { id: 'OrderConfirmedMessage', name: 'OrderConfirmedMessage' },
      { id: 'OrderPlacedMessage', name: 'OrderPlacedMessage' },
    ],
  )
})

test('AsyncAPI fixture exposes the exact publish and subscribe relationships', async () => {
  const { document } = await fromFile(new Parser(), asyncApiPath).parse()

  assert.ok(document)
  assert.deepEqual(
    document.operations()
      .map((operation) => ({
        action: operation.action(),
        id: operation.id(),
        messageIds: operation.messages().map((message) => message.id()),
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    [
      { action: 'receive', id: 'authorisePayment', messageIds: ['OrderPlacedMessage'] },
      { action: 'send', id: 'confirmOrder', messageIds: ['OrderConfirmedMessage'] },
      { action: 'receive', id: 'createShipment', messageIds: ['OrderConfirmedMessage'] },
      { action: 'receive', id: 'notifyCustomer', messageIds: ['OrderPlacedMessage'] },
      { action: 'send', id: 'processOrder', messageIds: ['OrderPlacedMessage'] },
      { action: 'receive', id: 'reserveInventory', messageIds: ['OrderPlacedMessage'] },
    ],
  )
})

test('AsyncAPI fixture contains no request-reply operation', async () => {
  const { document } = await fromFile(new Parser(), asyncApiPath).parse()

  assert.ok(document)
  assert.equal(document.operations().some((operation) => operation.json().reply !== undefined), false)
})
