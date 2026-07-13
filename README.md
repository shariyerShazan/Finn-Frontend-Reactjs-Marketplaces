# Finn Client - Frontend Web Application

A premium, modern marketplace and auction platform frontend built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. 

This repository containing the user and seller interface of **Finn** allows users to browse listings, bid on live auctions, buy products, chat in real-time, link Stripe accounts, manage profiles, and track locations on interactive maps.

## 🚀 Key Features

*   **Dual Marketplace Model**:
    *   **Fixed Price Listings**: Direct buy-now flow using Stripe payment links.
    *   **Auction Bidding System**: Place live bids on items with instant timer-based updates.
*   **Geospatial Ad Search**: Interactive mapping with **Leaflet** to find product location listings dynamically.
*   **Real-time Chat**: Connect directly with sellers and other buyers with sound notifications, online status indicators, blocking/unblocking, and image uploads.
*   **Stripe Connect & Payments**: Integration with Stripe for secure checkouts, subscription memberships, and platform fee settlements.
*   **Aesthetic User Panels**:
    *   **User/Buyer Panel**: Dashboard to track purchased items, bids, open conversations, and messages.
    *   **Seller Portal**: Inventory management, sales reports, Stripe onboarding, active boost packages, and subscription tracking.
    *   **Admin Dashboard**: User/Seller moderation, verification reviews, categorizations, and reporting systems.

---

## 🛠️ Technology Stack

*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (Fast Hot Module Replacement)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-safety)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (RTK Query for data fetching and caching)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (Smooth transitions and premium layouts)
*   **Interactive Maps**: [React Leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/)
*   **Real-time WS**: [Socket.io-client](https://socket.io/docs/v4/client-api/)
*   **Forms**: `react-hook-form`
*   **Router**: `react-router-dom` v7
*   **UI Components & Icons**: Radix UI primitives, Lucide React, React Icons, and Swiper Slider.

---

## 📂 Directories & Structure

```
├── docs.md/               # Detailed documentation guides & references
│   ├── CHAT_README.md     # Chat architecture overview
│   ├── CHAT_SETUP.md      # Step-by-step Socket setup
│   ├── QUICK_START.md     # 3-step testing environment startup
│   └── ... (more files)
├── public/                 # Static asset server directory
├── src/
│   ├── Layouts/           # Layout wrappers (Admin, Seller, Parent)
│   ├── components/        # Reusable UI widgets and custom UI elements
│   ├── hooks/             # Custom React hooks (socket handlers, etc.)
│   ├── redux/             # Redux Store + RTK API features
│   ├── main/              # User/Seller/Admin panels and page modules
│   ├── lib/               # Helper utilities & Socket service initialization
│   ├── App.tsx            # Root component routes
│   └── main.tsx           # Entrypoint file
├── package.json           # Scripts and dependency versions
├── tsconfig.json          # TypeScript configurations
└── vite.config.ts         # Vite bundler options
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [npm](https://www.npmjs.com/) (bundled with Node)

### 2. Installation
Navigate to the client directory and install the package dependencies:
```bash
npm install
```

### 3. Environment Variables Settings
Create a `.env` file referencing `.env.example` in the directory root:
```env
VITE_SOCKET_URL=http://localhost:3000       # Backend server Socket address
VITE_API_BASE_URL=http://localhost:3000/api # Backend REST API address
```

### 4. Direct Development Start
Launch the local dev server:
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 📖 Sub-Documentation Guides

For deeper configuration and development guides, refer to the documents in [docs.md](./docs.md/):
*   📄 **[Quick Start Guide](./docs.md/QUICK_START.md)**: 3-step guide for developers to get the chat and auth systems up and running.
*   📄 **[Chat Architecture](./docs.md/CHAT_README.md)**: Details of the state machine, RTK-query integration, and Socket.io routing.
*   📄 **[Chat Setup](./docs.md/CHAT_SETUP.md)**: In-depth setup parameters for local deployment.
*   📄 **[Testing Guide](./docs.md/TESTING_GUIDE.md)**: Scenarios to test end-to-end user transactions, auctions, and chat features.
*   📄 **[Implementation Summary](./docs.md/IMPLEMENTATION_SUMMARY.md)**: System upgrade summaries and UI module implementations.

---

## ⚖️ License
Proprietary - All rights reserved.
