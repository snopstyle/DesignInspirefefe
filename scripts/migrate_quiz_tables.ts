import { db } from "../db";
import { tempUsers, quizSessions, quizResults } from "../db/schema";
import { tempUsersNew, quizSessionsNew, quizResultsNew } from "../db/schemas/migrations";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

async function migrateQuizTables() {
  try {
    console.log('Starting quiz tables migration...');

    // 1. Create new tables
    console.log('Creating new tables...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS temp_users_new (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamp NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS quiz_sessions_new (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id integer,
        temp_user_id uuid,
        status text NOT NULL DEFAULT 'in_progress',
        current_question_id text,
        completed_questions jsonb NOT NULL DEFAULT '[]',
        answers jsonb NOT NULL DEFAULT '{}',
        started_at timestamp NOT NULL DEFAULT now(),
        last_updated timestamp NOT NULL DEFAULT now(),
        completed_at timestamp
      );

      CREATE TABLE IF NOT EXISTS quiz_results_new (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id integer,
        temp_user_id uuid,
        session_id uuid,
        answers jsonb NOT NULL,
        adaptive_flow jsonb NOT NULL,
        trait_scores jsonb NOT NULL,
        dominant_profile text NOT NULL,
        sub_profile text NOT NULL,
        traits jsonb NOT NULL,
        profile_match_scores jsonb NOT NULL,
        created_at timestamp NOT NULL DEFAULT now()
      );
    `);

    // 2. Migrate data from old to new tables
    console.log('Migrating data...');

    // Migrate temp users
    const existingTempUsers = await db.select().from(tempUsers);
    if (existingTempUsers.length > 0) {
      await db.insert(tempUsersNew).values(existingTempUsers);
    }

    // Migrate quiz sessions with UUID conversion
    const existingQuizSessions = await db.select().from(quizSessions);
    if (existingQuizSessions.length > 0) {
      await db.execute(sql`
        INSERT INTO quiz_sessions_new (
          id, user_id, temp_user_id, status, current_question_id, 
          completed_questions, answers, started_at, last_updated, completed_at
        )
        SELECT 
          id, user_id, 
          CASE 
            WHEN temp_user_id IS NULL THEN NULL 
            ELSE temp_user_id::uuid 
          END,
          status, current_question_id, completed_questions, answers,
          started_at, last_updated, completed_at
        FROM quiz_sessions;
      `);
    }

    // Migrate quiz results with UUID conversion
    const existingQuizResults = await db.select().from(quizResults);
    if (existingQuizResults.length > 0) {
      await db.execute(sql`
        INSERT INTO quiz_results_new (
          id, user_id, temp_user_id, session_id, answers, adaptive_flow,
          trait_scores, dominant_profile, sub_profile, traits, profile_match_scores,
          created_at
        )
        SELECT 
          id, user_id,
          CASE 
            WHEN temp_user_id IS NULL THEN NULL 
            ELSE temp_user_id::uuid 
          END,
          session_id, answers, adaptive_flow, trait_scores,
          dominant_profile, sub_profile, traits, profile_match_scores,
          created_at
        FROM quiz_results;
      `);
    }

    // 3. Drop old tables
    console.log('Dropping old tables...');
    await db.execute(sql`
      DROP TABLE IF EXISTS quiz_results;
      DROP TABLE IF EXISTS quiz_sessions;
      DROP TABLE IF EXISTS temp_users;
    `);

    // 4. Rename new tables to original names
    console.log('Renaming new tables...');
    await db.execute(sql`
      ALTER TABLE temp_users_new RENAME TO temp_users;
      ALTER TABLE quiz_sessions_new RENAME TO quiz_sessions;
      ALTER TABLE quiz_results_new RENAME TO quiz_results;
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

migrateQuizTables().catch(console.error);