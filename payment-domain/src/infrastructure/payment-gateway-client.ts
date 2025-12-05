export type PaymentGatewayResponse = {
  transactionId: string
  status: 'authorized' | 'completed' | 'failed' | 'refunded'
  message: string
}

export class PaymentGatewayClient {
  async authorizePayment(
    orderId: string,
    amount: number,
    currency: string
  ): Promise<PaymentGatewayResponse> {
    console.log(
      `[PaymentGatewayClient] Authorizing payment for order ${orderId}: ${amount} ${currency}`
    )

    return {
      transactionId: `txn_${Date.now()}`,
      status: 'authorized',
      message: 'Payment authorized successfully'
    }
  }

  async completePayment(transactionId: string): Promise<PaymentGatewayResponse> {
    console.log(`[PaymentGatewayClient] Completing payment: ${transactionId}`)

    return {
      transactionId,
      status: 'completed',
      message: 'Payment completed successfully'
    }
  }

  async refundPayment(
    transactionId: string,
    amount: number
  ): Promise<PaymentGatewayResponse> {
    console.log(
      `[PaymentGatewayClient] Refunding payment: ${transactionId}, amount: ${amount}`
    )

    return {
      transactionId,
      status: 'refunded',
      message: 'Refund processed successfully'
    }
  }
}
