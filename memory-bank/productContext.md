# Product Context: Gotime Settings Module

## Why This Project Exists

Gotime is a workforce management and scheduling system. The Settings Module provides a centralized interface for store managers to configure all aspects of their store operations, from employee management to business hours.

## Problems It Solves

1. **Fragmented Configuration** - Unifies all store settings in one place
2. **Complex Scheduling** - Simplifies opening hours with multi-period support
3. **Holiday Management** - Tracks recurring and one-time holidays/special dates
4. **Sales Planning** - Provides visibility into sales forecasts for staffing decisions
5. **PDV Organization** - Manages checkout positions and their configurations

## How It Should Work

### User Flow

1. User selects a store from the sidebar dropdown
2. Navigates between tabs: Colaboradores → PDV → Horários → Feriados → Previsão → Parâmetros
3. Each tab allows CRUD operations on its respective data
4. Changes are persisted and can be replicated across stores

### Key Interactions

- **Edit-in-place** tables for quick modifications
- **Drawers** for creating/editing complex entities (PDVs, Holidays)
- **Modals** for confirmations and replication workflows
- **Real-time validation** with Ant Design Forms

## User Experience Goals

- **Efficiency** - Minimize clicks to complete common tasks
- **Clarity** - Clear visual hierarchy using Ant Design components
- **Consistency** - Same interaction patterns across all tabs
- **Feedback** - Immediate response via message/notification system
