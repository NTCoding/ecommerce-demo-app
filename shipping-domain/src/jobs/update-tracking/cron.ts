import { Shipment } from '../../domain/Shipment'
import { CourierApiClient } from '../../infrastructure/courier-api-client'
import { ShippingEventPublisher } from '../../infrastructure/shipping-event-publisher'
import { UpdateTrackingUseCase } from './use-cases/update-tracking-use-case'

const courierApi = new CourierApiClient()
const publisher = new ShippingEventPublisher()
const updateTrackingUseCase = new UpdateTrackingUseCase(courierApi, publisher)

const shipments = new Map<string, Shipment>()

/** @backgroundJob */
async function runTrackingUpdate(): Promise<void> {
  console.log('[Shipping Cron] Running tracking update job...')

  await updateTrackingUseCase.apply(shipments)

  console.log('[Shipping Cron] Tracking update job completed')
}

setInterval(runTrackingUpdate, 5 * 60 * 1000)

console.log('[Shipping Cron] Tracking update job scheduled (every 5 minutes)')

runTrackingUpdate()
