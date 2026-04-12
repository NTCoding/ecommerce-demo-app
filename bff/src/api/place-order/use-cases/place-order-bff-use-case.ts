import { FraudDetectionClient } from '../../../infrastructure/fraud-detection-client'
import { CustomerServiceClient } from '../../../infrastructure/customer-service-client'
import { OrdersServiceClient } from '../../../infrastructure/orders-service-client'
import { InventoryServiceClient } from '../../../infrastructure/inventory-service-client'

export type PlaceOrderBFFRequest = {
  customerId: string
  items: Array<{ sku: string; quantity: number }>
  totalAmount: number
}

export type PlaceOrderBFFResponse = {
  orderId: string
  state: string
  inventoryStatus: string
  paymentStatus: string
}

export class PlaceOrderBFFUseCase {
  private readonly fraudDetection = new FraudDetectionClient()
  private readonly customerService = new CustomerServiceClient()
  private readonly ordersService = new OrdersServiceClient()
  private readonly inventoryService = new InventoryServiceClient()

  async apply(request: PlaceOrderBFFRequest): Promise<PlaceOrderBFFResponse> {
    const fraudCheckPassed = await this.fraudDetection.checkFraud(request.customerId, request.totalAmount)
    if (!fraudCheckPassed) {
      throw new Error('Order rejected due to fraud detection')
    }

    const customerProfile = await this.customerService.getProfile(request.customerId)

    const orderData = await this.ordersService.placeOrder({
      ...request,
      paymentMethodId: customerProfile.paymentMethodId
    })

    await Promise.all(
      request.items.map((item) =>
        this.inventoryService.checkStock(item.sku)
      )
    )

    return {
      orderId: orderData.orderId,
      state: orderData.state,
      inventoryStatus: 'checked',
      paymentStatus: 'pending'
    }
  }
}
