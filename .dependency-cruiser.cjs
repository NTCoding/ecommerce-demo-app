module.exports = {
  forbidden: [
    {
      name: 'no-conventions-outside-orders',
      comment: 'Only orders-domain may import from the conventions package. See README for domain strategies.',
      severity: 'error',
      from: {
        pathNot: '^orders-domain/'
      },
      to: {
        path: '@living-architecture/riviere-extract-conventions'
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true
  }
}
