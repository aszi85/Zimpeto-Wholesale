# Zimpeto Wholesale 🇲🇿🛒

**Zimpeto Wholesale** is a modern, high-performance web application designed for wholesale grocery and bulk goods e-commerce. Focused on the local market of Maputo, Mozambique, the application mimics the dynamic wholesale trade flow of the famous **Mercado do Zimpeto**, providing business owners and individuals a streamlined platform to buy in fardos (bales), boxes, and large bulk quantities at highly competitive wholesale rates.

The platform integrates Maputo-specific pricing (in Meticais - `MT`), custom shipping policies (such as free delivery above 5,000 MT), traditional Mozambican recipe integration, and standard local mobile money payments via **M-Pesa**.

---

## 🌟 Key Features

- **Wholesale-Focused E-commerce Catalog**: Custom quantity options (`qtdOptions`) for bulk packaging, real-time filters, dynamic price discounting tags, and multi-option select popups.
- **Traditional Mozambican Recipes Integration**: Browse traditional recipes like *Matapa*, *Caril de Peixe*, and *Frango Grelhado*, and click to buy all ingredients directly from the wholesale catalog.
- **Reactive Shopping Cart System**: A slide-out sidebar displaying order subtotals, item quantity adjustment steppers, and dynamic shipping calculations.
- **Three-Step Order Checkout**: 
  1. **Delivery vs. Pickup Selection**: Gathers complete customer metadata (Nome, Telemóvel, Bairro, Rua, etc.) with smart validations.
  2. **Vodacom M-Pesa Integration**: Simple instructions for local mobile money transfers with Vodacom and automated confirmation code inputs.
  3. **Order Confirmed Landing**: Provides dynamic reassurance to customers, displaying custom messaging and delivery dispatch information.
- **Fuzzy Search & Suggestions**: Instant search bar suggestions updating dynamically as you type, allowing direct catalog navigation.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: React Context API (`CartContext`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Assets & Media**: Unsplash and Bing high-quality CDN photography optimized for fast load times.

---

## 📂 Codebase Directory Map

```text
zimpeto-wholesale/
├── docs/                        # Extensive technical documentation
│   ├── ARCHITECTURE.md          # Architectural patterns and system flow
│   ├── DATA_MODELS.md           # Database data shape definitions and schemas
│   └── FEATURES.md              # User stories, operational guidelines, and checkout rules
├── src/
│   ├── app/                     # Next.js App Router (pages and layouts)
│   │   ├── checkout/            # Checkout funnel pages
│   │   ├── contacto/            # Customer feedback forms and contact information
│   │   ├── context/             # React State Providers (CartContext.tsx)
│   │   ├── localizacao/         # Maputo store locations and opening hours
│   │   ├── login/               # Authentication dashboard views (Login/Register tabs)
│   │   ├── loja/                # Complete catalog search, filtering, and sorting
│   │   ├── receitas/            # Mozambican culinary recipes list and single view
│   │   ├── globals.css          # Core CSS variables and Tailwind imports
│   │   ├── layout.tsx           # Global HTML wrapper (Navbar, CartSidebar, Footer)
│   │   └── page.tsx             # Interactive, visual Storefront Homepage
│   ├── components/              # Global reusable UI components
│   │   ├── AddToCartPopup.tsx   # Floating bulk selectors and item details
│   │   ├── CartSidebar.tsx      # Sidebar cart drawer with dynamic price/tax calculations
│   │   ├── Footer.tsx           # Standard corporate footer (Portuguese)
│   │   └── Navbar.tsx           # Responsive header with instant search bar suggestions
│   └── data.ts                  # Mock Database holding Products, Categories, and Recipes
├── package.json                 # Project dependencies and operational scripts
├── tsconfig.json                # TypeScript compilation guidelines
├── tailwind.config.js           # Customized Tailwind CSS utility design rules
└── postcss.config.js            # PostCSS utility rules
```

---

## 🚀 Getting Started

Follow these steps to set up, build, and run the project locally on your system.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) and [npm](https://www.npmjs.com/) installed.

### 1. Clone & Navigate

Navigate to the project root directory:
```bash
cd zimpeto-wholesale
```

### 2. Install Dependencies

Install the required npm packages listed in `package.json`:
```bash
npm install
```

### 3. Run Development Server

Launch the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to view the application in action.

### 4. Build for Production

Compile the TypeScript files and optimize the React code for deployment:
```bash
npm run build
```

### 5. Start Production Server

Run the optimized production build:
```bash
npm run start
```

---

## 📖 Additional Documentation

To learn more about how the project is built under the hood, read the dedicated guides inside the [docs/](file:///c:/Users/user/Downloads/zimpeto2/docs/) folder:

- 🏗️ **[Architecture & Component Design](file:///c:/Users/user/Downloads/zimpeto2/docs/ARCHITECTURE.md)**: Deep dive into the Page layout, global state flow, and Navbar search logic.
- 💾 **[Data Schemas & Database](file:///c:/Users/user/Downloads/zimpeto2/docs/DATA_MODELS.md)**: Details of the shapes for Products, Cart items, and Recipes database.
- ⚙️ **[Feature Logic & Workflows](file:///c:/Users/user/Downloads/zimpeto2/docs/FEATURES.md)**: Walkthrough of M-Pesa mobile checkout steps, shipping rules, and wholesale packing selections.

---

*Desenhado com orgulho para o Mercado Grossista do Zimpeto, Maputo.* 🇲🇿
