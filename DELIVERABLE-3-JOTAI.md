# ShopCart – Jotai State Management

## Overview

ShopCart is a React-based shopping cart application built using **Jotai** for state management. It demonstrates how shared application state can be managed using independent atoms and derived atoms.

## Features

- Fetch and display products from JSON Server.
- Add products to the shopping cart.
- Increase and decrease product quantities.
- Remove products from the cart.
- Display the total cart item count and price.
- Prevent quantities from exceeding available stock.
- Handle empty cart states.
- Place orders using the checkout API.
- Cancel ongoing checkout requests using `AbortController`.
- Display checkout success and error messages.

## Tech Stack

- React 19
- TypeScript
- Jotai
- Vite
- JSON Server
- CSS

## Jotai State Management

The application uses Jotai atoms to manage cart state.

- `cartItemsAtom`: Stores cart items.
- `addToCartAtom`: Adds products to the cart.
- `increaseQuantityAtom`: Increases product quantity.
- `decreaseQuantityAtom`: Decreases product quantity.
- `removeFromCartAtom`: Removes products from the cart.
- `clearCartAtom`: Clears the cart.
- `cartCountAtom`: Calculates the total number of cart items.
- `cartTotalAtom`: Calculates the total cart price.
- `checkoutAtom`: Handles checkout and order creation.

## Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start JSON Server

```bash
npm run server
```

JSON Server runs at `http://localhost:3001`.

### 3. Start the React application

Open another terminal and run:

```bash
npm run dev
```

The application runs at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run server` | Starts JSON Server |
| `npm run build` | Creates the production build |
| `npm run lint` | Runs Oxlint |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Fetches products |
| POST | `/api/orders` | Creates an order |

## Validation

The implementation can be validated using:

```bash
npx tsc --noEmit
npm run lint
npm run build
```