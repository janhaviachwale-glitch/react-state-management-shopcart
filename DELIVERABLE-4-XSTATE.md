
# Deliverable 4 – Checkout Workflow Using XState

## Overview

This deliverable implements a checkout workflow using **XState** and integrates it with the existing **Zustand cart store**.

Zustand manages the shopping cart data and cart operations, while XState manages the checkout workflow, including validation, processing, success, failure and cancellation.

## Technologies Used

- React 19
- TypeScript
- Zustand
- XState 5
- @xstate/react
- Vite
- JSON Server

## Implementation Details

### 1. Zustand Cart Store

The existing Zustand store is responsible for managing cart data and operations.

The store provides the following functionality:

- Add products to the cart.
- Increase and decrease product quantities.
- Remove products from the cart.
- Clear the cart after successful checkout.
- Prevent product quantities from exceeding available stock.

### 2. XState Checkout Machine

The checkout workflow is implemented using XState in:

`src/machines/checkoutMachine.ts`

The machine manages the following states:

| State | Description |
|---|---|
| idle | Waits for the user to initiate checkout. |
| validating | Checks whether the cart contains products. |
| processing | Sends the checkout request to the API. |
| success | Displays the success message and clears the cart. |
| failure | Handles checkout errors and allows retrying. |
| cancelled | Handles cancellation of an ongoing checkout request. |

### 3. Checkout API Integration

The checkout machine uses an XState promise actor to send a POST request to:

`/api/orders`

The order contains:

- Product IDs and names.
- Product prices and quantities.
- Total order amount.
- Order status.
- Order creation timestamp.

JSON Server stores the submitted orders in `db.json`.

### 4. Checkout Cancellation

The checkout actor receives an `AbortSignal` provided by XState.

When the user clicks **Cancel Checkout**, the machine transitions from the processing state to the cancelled state.

XState stops the invoked actor, which aborts the associated API request.

The cart items remain unchanged when checkout is cancelled.

### 5. React Integration

The `CartDrawer` component uses `useMachine` from `@xstate/react` to interact with the checkout machine.

It displays the current checkout status and provides the following actions:

- Start checkout.
- Cancel an ongoing checkout.
- Retry checkout after a failure.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start JSON Server

```bash
npm run server
```

JSON Server runs at:

`http://localhost:3001`

### 3. Start the React Application

Open another terminal and run:

```bash
npm run dev
```

The application runs at:

`http://localhost:5173`

## Testing

The following scenarios should be verified:

1. Display products and add them to the cart.
2. Increase and decrease product quantities.
3. Verify that cart quantities respect available stock.
4. Verify the cart badge and total amount.
5. Complete checkout and verify that an order is created.
6. Verify that the cart is cleared after successful checkout.
7. Cancel checkout while the request is processing.
8. Verify that the cart remains unchanged after cancellation.
9. Verify that failed checkout requests display an error and allow retrying.

For cancellation testing, use the browser's Network tab and verify that the aborted request is marked as `(canceled)`.