# 💾 Data Schemas & Database

This document acts as a technical schema guide for developers working on the database, API integrators, or front-end components. Since the application currently runs on a fast static local database mock (`src/data.ts`), these shapes dictate how objects are formatted and validated.

---

## 1. Product Data Schema (`ProductData`)

The `ProductData` interface defines the attributes for items in our catalogue, supporting both promotional tags and dynamic quantity variations.

### TypeScript Definition
```typescript
export interface ProductData {
  id: string;                      // Unique product identifier (e.g., 'p1', 'p2')
  name: string;                    // Commercial product name (e.g., 'Arroz Don Pato (25kg)')
  price: number;                   // Active selling price in Meticais (MT)
  oldPrice?: number;               // Original price in MT (triggers saving calculations and badges)
  img: string;                     // Absolute URL to photography assets hosted on Unsplash/Bing CDN
  tag?: string;                    // Short promotional text (e.g., 'POUPANÇA', 'DESTAQUE', 'ESSENCIAL')
  details?: Record<string, string>;// Key-value pair of specifications (e.g., Weight, Brand, Validity)
  qtdOptions?: number[];           // Predefined bulk quantities for rapid order addition
  category?: string;               // Category key mapping to CATEGORIES definition
}
```

### Field Breakdown & Validation Rules
- **`price` & `oldPrice`**: Must be positive integers. When `oldPrice` is populated, the frontend automatically renders a discount percentage badge calculated as:
  $$\text{Percentage} = \text{round}\left( \frac{\text{oldPrice} - \text{price}}{\text{oldPrice}} \times 100 \right)$$
- **`qtdOptions`**: Represents the bulk sales multiplier. For instance, `[1, 2, 5, 10]` indicates that a customer can order fardos or individual units in multiples of these specific quantities.
- **`details`**: Renders custom product specifications in the quantity modal, ensuring customers get granular details (such as origin or expiration dates) without cluttering the main page cards.

---

## 2. Shopping Cart Schema (`CartItem`)

The `CartItem` schema represents active items stored in the customer's shopping cart. It inherits all attributes of the base `ProductData` model, extending it with a reactive tracking quantity.

### TypeScript Definition
```typescript
export interface CartItem extends ProductData {
  qtd: number; // Current quantity selected by the user (must be >= 1)
}
```

### Derived Values & Real-time Math
Using the React Context, our state provider dynamically computes cart figures:
- **`cartCount`**: Total number of items in the cart:
  $$\text{cartCount} = \sum (\text{item.qtd})$$
- **`cartTotal`**: Sum total of the cart value in Meticais:
  $$\text{cartTotal} = \sum (\text{item.price} \times \text{item.qtd})$$
- **Free Delivery Eligibility**: If $\text{cartTotal} \ge 5000$, the delivery charge is set to $0$ MT.

---

## 3. Product Categories

The application segments bulk products into cohesive taxonomies to simplify catalog browsing.

### Schema Definition
```typescript
export interface Category {
  id: string;    // Unique lowercase category key (e.g., 'cereais', 'vegetais')
  label: string; // User-facing localized category name (e.g., 'Cereais', 'Vegetais')
}
```

### Available Categories
The system supports the following standard taxonomies defined in `src/data.ts`:
1. 🌾 **`cereais`**: Rice, flours, and grains.
2. 🥬 **`vegetais`**: Fresh agricultural market produce (tomatoes, onions, potatoes).
3. 🥩 **`carnes`**: Frozen and fresh meats (whole chicken boxes).
4. 🧂 **`mercearia`**: Cooking oils, sugars, and salts.
5. 🧼 **`higiene`**: Laundry detergents and hygiene products.
6. 🥤 **`bebidas`**: Mineral waters and juices.
7. 🥛 **`laticinios`**: Long-life milk cases.
8. 🫘 **`leguminosas`**: Beans and legumes.

---

## 4. Culinary Recipes Schema (`Recipe`)

The **Receitas da Nossa Terra** feature showcases traditional Mozambican dishes and matches them directly with wholesale ingredients.

### TypeScript Definition
```typescript
export interface Recipe {
  id: number;              // Unique identifier (numeric, e.g., 1, 2)
  title: string;           // Traditional dish name (e.g., 'Matapa Tradicional')
  description: string;     // Short historical/taste description
  img: string;             // Cover illustration asset URL
  time: string;            // Average preparation duration (e.g., '90 min')
  difficulty: string;      // Culinary complexity (e.g., 'Fácil', 'Médio')
  servings: number;        // Suggested serving size (e.g., 6)
  ingredients: string[];   // Bullet lists of required ingredients
  steps: string[];         // Step-by-step cooking instructions
}
```

### Feature Integration
The recipe view includes a quick-action link that redirects customers back to the `/loja` catalog. This encourages immediate shopping for ingredients like amendoim (peanuts), leite de coco (coconut milk), and mariscos (seafood) in wholesale quantities.
