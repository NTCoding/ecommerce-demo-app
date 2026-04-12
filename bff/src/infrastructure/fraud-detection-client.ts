/** @httpClient */
export class FraudDetectionClient {
  readonly serviceName = 'Fraud Detection Service'
  readonly route = '/api/check'

  async checkFraud(customerId: string, totalAmount: number): Promise<boolean> {
    const response = await fetch('http://fraud-detection-service.internal/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, totalAmount })
    })
    const data = (await response.json()) as { approved: boolean }
    return data.approved
  }
}
