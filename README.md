# Queue Ease

AI-Powered Forecasting and SMS Alerts System.

## Overview

Queue Ease is structured as a role-based web platform for queue operations, demand forecasting, reporting, and SMS notifications. This repository currently contains the production-oriented project scaffold only; no application, API, authentication, database, or forecasting logic has been implemented.

## Tech Stack

- Frontend: Next.js 15, TypeScript, App Router, Tailwind CSS, shadcn/ui, Axios, React Hook Form, Zod, and Recharts
- Backend: Laravel 12 REST API, Laravel Sanctum, service layer, repository pattern, and Spatie Permission
- AI service: Python, Flask, scikit-learn, Pandas, NumPy, and Joblib
- Database: MySQL
- SMS: Semaphore API

## Folder Structure

```text
QueueEase/
├── frontend/    # Next.js role-based interface scaffold
├── backend/     # Laravel extension-layer scaffold
├── ai-service/  # Flask and machine-learning service scaffold
└── docs/        # Architecture, API, database, UI, and deployment documentation
```

## User Roles

- System Administrator — `/admin`
- Service Staff — `/staff`
- Client — `/client`

Each role has an isolated dashboard route and layout placeholder in the frontend structure.

## Development Architecture

The project is organized around clean architecture and SOLID principles. The frontend separates routes, shared UI areas, features, services, and cross-cutting concerns. The backend reserves dedicated service, repository, interface, DTO, action, and policy layers. The AI service separates route, preprocessing, prediction, training, model, dataset, and configuration concerns.

This scaffold deliberately contains no business logic or runtime configuration. Add framework-generated files and implementations only when development begins.
