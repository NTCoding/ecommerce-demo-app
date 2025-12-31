# Step 4: Component Linking Checklist

## UI Components

- [x] OrderPage (ui) - `ui:pages:ui:orderpage`

## API Components

- [x] PUT /shipments/:shipmentId/dispatch (shipping-domain) - `shipping-domain:server:api:put-/shipments/:shipmentid/dispatch`
- [x] POST /orders (orders-domain) - `orders-domain:server:api:post-/orders`
- [x] DELETE /orders/:orderId (orders-domain) - `orders-domain:server:api:delete-/orders/:orderid`
- [x] GET /inventory/:sku (inventory-domain) - `inventory-domain:server:api:get-/inventory/:sku`
- [x] POST /bff/orders (bff) - `bff:server:api:post-/bff/orders`

## UseCase Components

- [x] UpdateTrackingUseCase (shipping-domain) - `shipping-domain:jobs/update-tracking/use-cases:usecase:updatetrackingusecase`
- [x] CreateShipmentUseCase (shipping-domain) - `shipping-domain:consumer/order-confirmed/use-cases:usecase:createshipmentusecase`
- [x] DispatchShipmentUseCase (shipping-domain) - `shipping-domain:api/dispatch-shipment/use-cases:usecase:dispatchshipmentusecase`
- [x] ReserveInventoryUseCase (inventory-domain) - `inventory-domain:consumer/order-placed/use-cases:usecase:reserveinventoryusecase`
- [x] NotifyShipmentDeliveredUseCase (notifications-domain) - `notifications-domain:consumer/shipment-delivered/use-cases:usecase:notifyshipmentdeliveredusecase`
- [x] ProcessPaymentUseCase (payment-domain) - `payment-domain:consumer/order-placed/use-cases:usecase:processpaymentusecase`
- [x] AllocateInventoryUseCase (inventory-domain) - `inventory-domain:consumer/shipment-created/use-cases:usecase:allocateinventoryusecase`
- [x] NotifyPaymentCompletedUseCase (notifications-domain) - `notifications-domain:consumer/payment-completed/use-cases:usecase:notifypaymentcompletedusecase`
- [x] ReleaseInventoryUseCase (inventory-domain) - `inventory-domain:consumer/order-cancelled/use-cases:usecase:releaseinventoryusecase`
- [x] RefundPaymentUseCase (payment-domain) - `payment-domain:consumer/order-cancelled/use-cases:usecase:refundpaymentusecase`
- [x] CheckStockUseCase (inventory-domain) - `inventory-domain:api/check-stock/use-cases:usecase:checkstockusecase`
- [x] NotifyOrderPlacedUseCase (notifications-domain) - `notifications-domain:consumer/order-placed/use-cases:usecase:notifyorderplacedusecase`
- [x] NotifyShipmentDispatchedUseCase (notifications-domain) - `notifications-domain:consumer/shipment-dispatched/use-cases:usecase:notifyshipmentdispatchedusecase`
- [x] CompleteOrderUseCase (orders-domain) - `orders-domain:consumer/shipment-delivered/use-cases:usecase:completeorderusecase`
- [x] CancelOrderAfterPaymentFailureUseCase (orders-domain) - `orders-domain:consumer/payment-failed/use-cases:usecase:cancelorderafterpaymentfailureusecase`
- [x] ConfirmOrderAfterPaymentUseCase (orders-domain) - `orders-domain:consumer/payment-completed/use-cases:usecase:confirmorderafterpaymentusecase`
- [x] ConfirmOrderAfterInventoryUseCase (orders-domain) - `orders-domain:consumer/inventory-reserved/use-cases:usecase:confirmorderafterinventoryusecase`
- [x] ShipOrderUseCase (orders-domain) - `orders-domain:consumer/shipment-dispatched/use-cases:usecase:shiporderusecase`
- [x] CancelOrderUseCase (orders-domain) - `orders-domain:api/cancel-order/use-cases:usecase:cancelorderusecase`
- [x] PlaceOrderUseCase (orders-domain) - `orders-domain:api/place-order/use-cases:usecase:placeorderusecase`
- [x] PlaceOrderBFFUseCase (bff) - `bff:api/place-order/use-cases:usecase:placeorderbffusecase`

## EventHandler Components

- [x] handleOrderConfirmed (shipping-domain) - `shipping-domain:consumer/order-confirmed:eventhandler:handleorderconfirmed`
- [x] handleShipmentDelivered (notifications-domain) - `notifications-domain:consumer/shipment-delivered:eventhandler:handleshipmentdelivered`
- [x] handleOrderPlaced (payment-domain) - `payment-domain:consumer/order-placed:eventhandler:handleorderplaced`
- [x] handlePaymentCompleted (notifications-domain) - `notifications-domain:consumer/payment-completed:eventhandler:handlepaymentcompleted`
- [x] handleOrderPlaced (notifications-domain) - `notifications-domain:consumer/order-placed:eventhandler:handleorderplaced`
- [x] handleOrderPlaced (inventory-domain) - `inventory-domain:consumer/order-placed:eventhandler:handleorderplaced`
- [x] handleShipmentDispatched (notifications-domain) - `notifications-domain:consumer/shipment-dispatched:eventhandler:handleshipmentdispatched`
- [x] handleShipmentCreated (inventory-domain) - `inventory-domain:consumer/shipment-created:eventhandler:handleshipmentcreated`
- [x] handleShipmentDelivered (orders-domain) - `orders-domain:consumer/shipment-delivered:eventhandler:handleshipmentdelivered`
- [x] handlePaymentFailed (orders-domain) - `orders-domain:consumer/payment-failed:eventhandler:handlepaymentfailed`
- [x] handleOrderCancelled (inventory-domain) - `inventory-domain:consumer/order-cancelled:eventhandler:handleordercancelled`
- [x] handlePaymentCompleted (orders-domain) - `orders-domain:consumer/payment-completed:eventhandler:handlepaymentcompleted`
- [x] handleInventoryReserved (orders-domain) - `orders-domain:consumer/inventory-reserved:eventhandler:handleinventoryreserved`
- [x] handleShipmentDispatched (orders-domain) - `orders-domain:consumer/shipment-dispatched:eventhandler:handleshipmentdispatched`
- [x] handleOrderCancelled (payment-domain) - `payment-domain:consumer/order-cancelled:eventhandler:handleordercancelled`

## Custom Components

- [x] update-tracking (shipping-domain) - `shipping-domain:jobs/update-tracking:custom:update-tracking`
