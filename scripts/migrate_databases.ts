import { db as currentDb } from '../db';
import { formationDb, authDb, quizDb } from '../db/config';
import * as schema from '../db/schema';
import * as formationSchema from '../db/schemas/formation';
import * as authSchema from '../db/schemas/auth';
import * as quizSchema from '../db/schemas/quiz';

async function migrateData() {
  try {
    console.log('Starting database migration...');

    // 1. Migrate formation data
    console.log('Migrating formation data...');
    const establishments = await currentDb.select().from(schema.establishments);
    const locations = await currentDb.select().from(schema.locations);
    const costs = await currentDb.select().from(schema.costs);
    const pedagogyTypes = await currentDb.select().from(schema.pedagogyTypes);
    const formations = await currentDb.select().from(schema.formations);

    await formationDb.insert(formationSchema.establishments).values(establishments);
    await formationDb.insert(formationSchema.locations).values(locations);
    await formationDb.insert(formationSchema.costs).values(costs);
    await formationDb.insert(formationSchema.pedagogyTypes).values(pedagogyTypes);
    await formationDb.insert(formationSchema.formations).values(formations);

    // 2. Migrate auth data
    console.log('Migrating auth data...');
    const users = await currentDb.select().from(schema.users);
    await authDb.insert(authSchema.users).values(users);

    // 3. Migrate quiz data
    console.log('Migrating quiz data...');
    const tempUsers = await currentDb.select().from(schema.tempUsers);
    const quizSessions = await currentDb.select().from(schema.quizSessions);
    const quizResults = await currentDb.select().from(schema.quizResults);
    const profileCompletions = await currentDb.select().from(schema.profileCompletion);

    await quizDb.insert(quizSchema.tempUsers).values(tempUsers);
    await quizDb.insert(quizSchema.quizSessions).values(quizSessions);
    await quizDb.insert(quizSchema.quizResults).values(quizResults);
    await quizDb.insert(quizSchema.profileCompletion).values(profileCompletions);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

migrateData().catch(console.error);
