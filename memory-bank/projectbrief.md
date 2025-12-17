# Project Brief: Gotime Settings Module

## Overview

The **Gotime Settings Module** is an enterprise-grade React application for managing store configurations, including collaborators, PDVs (point of sale), business hours, holidays, and sales forecasts.

## Core Requirements

### Functional Requirements

1. **Store Management** - Multi-store selection and configuration
2. **Collaborators Tab** - Manage store employees, roles, and work schedules
3. **PDV Tab** - Configure point of sale terminals (position, type, orientation)
4. **Opening Hours Tab** - Define business hours with multiple time periods per day
5. **Holidays Tab** - Manage holidays, special dates, and recesses
6. **Sales Forecast Tab** - View and manage daily sales predictions
7. **Parameters Tab** - Configure shift rules, breaks, and service levels

### Technical Requirements

1. **React 18+** with **Vite** for fast development
2. **TypeScript** in strict mode (no `any` types)
3. **Ant Design v5+** exclusively for UI components
4. **dayjs** for date handling
5. **3-layer architecture**: Services → Hooks → Components

## Key Constraints

- No native HTML elements (use Ant Design equivalents)
- No hardcoded design values (use Ant Design tokens)
- All data access through service layer
- Components must be presentational only

## Success Metrics

- Developer experience: new features in hours, not days
- Maintainability: clear separation of concerns
- Consistency: unified visual design via Ant Design tokens
