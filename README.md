# POS/ERP System

Empower your business with this modular POS/ERP system. Designed for industries such as retail and manufacturing, it integrates with core business processes, including sales, inventory management, and financial reporting.

## Features

* **User Management**: Secure staff profiles with role-based access (admin, cashier, etc.).
* **Authentication**: JWT-based login for robust security.
* **Products**: Real-time inventory tracking for all your items.
* **Sales**: Record transactions and update stock instantly.
* **Purchases**: Manage suppliers and purchase orders with ease.
* **Inventory Adjustments**: Correct stock levels with detailed history.
* **Reports**: Gain insights with sales, purchases, low stock, and adjustment reports.
* **Scalability**: Modular design ready for customization (e.g., production tracking for manufacturing businesses).

## Why Choose This System?

* **Ready to Use**: Core modules are fully implemented and tested.
* **Customizable**: Easily adapt to specific needs.
* **Open Source**: Hosted on GitHub for transparency and collaboration.
* **Secure**: Admin-only access for sensitive operations like reports and adjustments.

## Getting Started

### Prerequisites

* Node.js (v16+)
* PostgreSQL (or your preferred TypeORM-supported DB)
* Git

### Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/malachsalama/IceProject-Backend.git
cd iceproject-backend
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Configure Environment**:
   * Copy .env.example to .env and update with your database credentials and JWT secret

4. **Run Migrations**:
```bash
npm run migration:run
```

5. **Start the Application**:
```bash
npm run start:dev
```
 Access the API at http://localhost:3000.

## API Documentation

* Swagger UI: http://localhost:3000/api/docs
* Explore endpoints for users, sales, purchases, inventory, and reports.

## Usage

* **Admin Login**: Use /auth/login with admin credentials to get a JWT token.
* **Sample Requests**:
   * Create a sale: POST /sales (requires JWT).
   * Adjust inventory: POST /inventory/adjustments (admin only).
   * View sales report: GET /reports/sales?startDate=2025-01-01&endDate=2025-12-31 (admin only).

## Customization

Need table management or customer order customization? This system is built to adapt:
* Add new modules (e.g., RestaurantModule for a hospitality business).
* Extend entities (e.g., add TableReservation for a restaurant).
* Contact me to tailor it to your business!

## Testing

Run unit tests to ensure reliability:
```bash
npm run test
```

## Contributing

Contributions are welcome! Fork the repo, create a branch, and submit a pull request with your enhancements.

## License

- Free to use, modify, and distribute.