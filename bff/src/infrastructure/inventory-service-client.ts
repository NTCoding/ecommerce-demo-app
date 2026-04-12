/** @httpClient */
export class InventoryServiceClient {
  readonly serviceName = 'inventory'
  readonly route = '/inventory/:sku'

  async checkStock(sku: string): Promise<Response> {
    return fetch(`http://localhost:3001/inventory/${sku}`)
  }
}
