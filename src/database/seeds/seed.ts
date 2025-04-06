import { AppDataSource } from '../data-source';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole } from '../../modules/users/entities/user.enums';
import { Product } from '../../modules/products/entities/product.entity';
import { Supplier } from '../../modules/purchases/entities/supplier.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    // Initialize the data source
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);
    const supplierRepository = AppDataSource.getRepository(Supplier);

    // Seed Admin User
    const adminExists = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!adminExists) {
      const admin = userRepository.create({
        full_name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.ADMIN,
      });
      await userRepository.save(admin);
      console.log('Admin user created: admin@example.com / password123');
    }

    // Seed Cashier User
    const cashierExists = await userRepository.findOne({
      where: { email: 'cashier@example.com' },
    });
    if (!cashierExists) {
      const cashier = userRepository.create({
        full_name: 'Cashier User',
        email: 'cashier@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.CASHIER,
      });
      await userRepository.save(cashier);
      console.log('Cashier user created: cashier@example.com / password123');
    }

    // Seed Products
    const productsExist = await productRepository.count();
    if (productsExist === 0) {
      const products = productRepository.create([
        {
          name: 'Laptop',
          sku: 'LAP001',
          price: 999.99,
          stock: 50,
        },
        {
          name: 'Mouse',
          sku: 'MOU001',
          price: 29.99,
          stock: 100,
        },
        {
          name: 'Keyboard',
          sku: 'KEY001',
          price: 59.99,
          stock: 75,
        },
      ]);
      await productRepository.save(products);
      console.log('Products seeded: Laptop, Mouse, Keyboard');
    }

    // Seed Supplier
    const suppliersExist = await supplierRepository.count();
    if (suppliersExist === 0) {
      const supplier = supplierRepository.create({
        name: 'Tech Supplies Inc.',
        contact_name: 'John Smith',
        contact_email: 'john@techsupplies.com',
        contact_phone: '+1234567890',
        address: '4th Ngong Avenue, Upperhill, Nairobi',
      });
      await supplierRepository.save(supplier);
      console.log('Supplier seeded: Tech Supplies Inc.');
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed().catch((error) => {
  console.error('An error in seeding:', error);
  process.exit(1);
});
