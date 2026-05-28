# ⚙️ Feature Logic & Workflows

This document outlines the core business logic, user flows, and operational constraints implemented across the **Zimpeto Wholesale** application. It serves as a operational handbook for product managers and test engineers.

---

## 1. Wholesale & Bulk Packing Systems

Unlike conventional retail stores, **Zimpeto Wholesale** is built from the ground up to support high-volume bulk shopping.

### A. Predefined Packaging Multipliers (`qtdOptions`)
- To prevent friction during checkout, products are seeded with predefined order sizes representing commercial packing configurations (fardos/bales, boxes, bags).
- For example, **Arroz Don Pato (25kg)** uses `[1, 2, 5, 10]`, allowing customers to quickly order common quantities.
- Selecting a preset quantity automatically updates the active price calculation inside the modal, calculating the total price and the exact savings:
  $$\text{Savings} = (\text{oldPrice} - \text{price}) \times \text{Quantity}$$

### B. Custom Quantity Steppers
- When users require non-standard quantities, they can use the numeric stepper buttons (`−` / `+`).
- The custom stepper guarantees that the selected quantity is always a positive integer ($\ge 1$).

---

## 2. Shipping & Regional Delivery Rules

To optimize regional transport logistics across Maputo, the app implements automated shipping rules based on order size:

> [!TIP]
> **Shipping Rule threshold**:
> - 🟢 **Orders $\ge$ 5,000 MT**: Free delivery within Maputo and Matola.
> - 🔴 **Orders < 5,000 MT**: Displayed as **"+ A calcular"** (Subject to post-order shipping calculation).

### Shopping Encouragement
The `CartSidebar` calculates this threshold in real-time. If the total is close to `5,000 MT`, it shows dynamic status alerts to encourage users to add a few more items to qualify for free delivery, driving higher average order values.

---

## 3. The 3-Step Checkout Funnel

The checkout process (`src/app/checkout/page.tsx`) is designed as a simple, high-converting three-step wizard:

```text
+-----------------------+      +-----------------------+      +-----------------------+
|  Step 1: Details      | ---> |  Step 2: Payment      | ---> |  Step 3: Confirmed    |
| - Delivery vs. Pickup |      | - M-Pesa Instructions |      | - Show metadata       |
| - Address Validations |      | - Confirm Code Input  |      | - Clear global cart   |
+-----------------------+      +-----------------------+      +-----------------------+
```

### 📋 Step 1: Customer & Delivery Details
- Users toggle between **"Entrega"** (Delivery) and **"Levantamento"** (In-store Pickup).
- When "Entrega" is active, form validations require the Bairro and Rua fields.
- Captures essential customer metadata:
  - *Nome Completo* (Full Name)
  - *Telemóvel* (Mobile number)
  - *Bairro* (Neighborhood in Maputo/Matola)
  - *Rua* (Street name)
  - *Nº da Casa* (House number)
  - *Referência* (Landmark reference)

### 📲 Step 2: Vodacom M-Pesa Mobile Payments
- When the user proceeds to Step 2, the app displays localized, step-by-step M-Pesa mobile transfer instructions:
  1. *Send the total order amount to Vodacom merchant number: **84 000 0000** (Zimpeto Wholesale).*
  2. *Send the payment confirmation receipt or screenshot to our WhatsApp.*
- The user is required to enter their **M-Pesa transaction confirmation code** (limited to Vodacom's 9-digit format) to proceed.
- The user must check the **"Concordo com as políticas de venda"** (Agree to sales policies) checkbox to enable the confirmation button.

### 🎉 Step 3: Order Confirmed
- On click, the global shopping cart state is reset (`clearCart()`), preventing duplicate orders.
- The app renders a confirmation success screen displaying the customer's mobile number, assuring them that a customer service agent will contact them shortly to schedule delivery.

---

## 4. Recipe-to-Shop Redirection

The **Receitas da Nossa Terra** section (`src/app/receitas/page.tsx`) goes beyond standard cooking instructions, serving as a powerful sales funnel:

1. **Recipe Discovery**: Users explore traditional Mozambican dishes (e.g., *Matapa*, *Caril de Peixe*) with full lists of ingredients, prep times, and visual cooking steps.
2. **Catalog Redirection**: Each recipe page features a prominent **"Comprar Ingredientes na Loja →"** button.
3. **Immediate Ordering**: Clicking this link redirects the user directly to the `/loja` catalog, allowing them to instantly purchase the bulk ingredients needed for the recipe.

---

## 5. Instant Suggestions Search Logic

The primary search utility (`src/components/Navbar.tsx`) is designed for fast, frictionless product discovery:

- **Autocomplete Suggestions**: As users type into the search bar, the app filters the `ALL_PRODUCTS` database in real-time.
- **Substring Matching**: The search matching is case-insensitive, finding any product name that contains the query string:
  ```typescript
  const suggestions = searchQuery.length > 1 
    ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) 
    : [];
  ```
- **Instant Search Redirection**: Clicking a search suggestion redirects the user to the `/loja?q=ProductName` catalog page with the search filter pre-applied, letting them add the item to their cart in seconds.
