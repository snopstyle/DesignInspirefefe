
import { db } from '../db';
import { users } from '../db/schemas/auth';

async function cleanupAuthData() {
  try {
    console.log('Starting auth data cleanup...');

    // Delete all users
    const deletedUsers = await db.delete(users).returning();
    console.log(`Deleted ${deletedUsers.length} users from auth table`);

    console.log('Auth data cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

cleanupAuthData().catch(console.error);
