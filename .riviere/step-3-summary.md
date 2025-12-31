# Step 3: Extraction Summary

## Total Components: 76

### By Type
| Type | Count |
|------|-------|
| DomainOp | 23 |
| UseCase | 21 |
| EventHandler | 15 |
| Event | 10 |
| API | 5 |
| BackgroundJob (Custom) | 1 |
| UI | 1 |

### By Domain
| Domain | Total | API | UseCase | DomainOp | Event | EventHandler | BackgroundJob | UI |
|--------|-------|-----|---------|----------|-------|--------------|---------------|-----|
| orders-domain | 24 | 2 | 7 | 7 | 3 | 5 | - | - |
| inventory-domain | 14 | 1 | 4 | 5 | 1 | 3 | - | - |
| shipping-domain | 14 | 1 | 3 | 5 | 3 | 1 | 1 | - |
| payment-domain | 11 | - | 2 | 4 | 3 | 2 | - | - |
| notifications-domain | 10 | - | 4 | 2 | - | 4 | - | - |
| bff | 2 | 1 | 1 | - | - | - | - | - |
| ui | 1 | - | - | - | - | - | - | 1 |

## Verification
- All 7 domains have components
- All expected component types extracted
- Graph file: `.riviere/graph.json`

## Note
CLI `component-summary` command has a validation bug with Custom types. Summary generated manually via jq.
