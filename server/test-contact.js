import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Contact } from './src/models/Contact.js';

dotenv.config();

const testDbAndModel = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/contact_us_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('MongoDB connected successfully.');

    // Create a sample contact inquiry
    const testData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 987-654-3210',
      address: '456 Innovation Blvd, Tech Park, Suite 101',
      subject: 'Inquiry regarding Enterprise Support',
      message: 'Hello, our team would like to integrate the staff directory with our ERP system.',
    };

    console.log('Creating test contact record in MongoDB...');
    const created = await Contact.create(testData);
    console.log('Successfully created Contact record:');
    console.log({
      id: created._id,
      name: `${created.firstName} ${created.lastName}`,
      email: created.email,
      phone: created.phone,
      address: created.address,
      subject: created.subject,
      createdAt: created.createdAt,
    });

    // Query record back from MongoDB
    const queried = await Contact.findById(created._id);
    if (!queried) {
      throw new Error('Could not retrieve created contact from MongoDB!');
    }
    console.log('Successfully queried contact record from MongoDB!');

    // Count records
    const totalCount = await Contact.countDocuments();
    console.log(`Total contact records currently in database: ${totalCount}`);

    console.log('All MongoDB tests passed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

testDbAndModel();
