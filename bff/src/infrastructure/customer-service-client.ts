/** @httpClient */
export class CustomerServiceClient {
  readonly serviceName = 'Customer Service'
  readonly route = '/api/customers/:id/profile'

  async getProfile(customerId: string): Promise<{ paymentMethodId: string }> {
    const response = await fetch(`http://customer-service.internal/api/customers/${customerId}/profile`)
    return (await response.json()) as { paymentMethodId: string }
  }
}
