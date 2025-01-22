import { db } from "../db";
import { sql } from "drizzle-orm";

async function migrateTables() {
  try {
    console.log('Starting table migration...');

    // Formation tables
    console.log('Migrating formation tables...');
    await db.execute(sql`
      -- Create tables without constraints first
      CREATE TABLE IF NOT EXISTS formation_establishments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        statut text NOT NULL,
        hebergement boolean DEFAULT false,
        lien text,
        tel text,
        facebook text,
        instagram text,
        linkedin text,
        created_at timestamp NOT NULL DEFAULT now()
      );

      -- Create a temporary table to store links with duplicates
      CREATE TEMP TABLE duplicate_links AS
      SELECT lien, COUNT(*) as count
      FROM establishments
      WHERE lien != 'Non Renseigné'
      GROUP BY lien
      HAVING COUNT(*) > 1;

      -- Create another temporary table for primary establishments
      CREATE TEMP TABLE primary_establishments AS
      SELECT DISTINCT ON (e.lien) e.id as primary_id, e.lien
      FROM establishments e
      INNER JOIN duplicate_links d ON e.lien = d.lien
      ORDER BY e.lien, e.created_at;

      -- Insert non-duplicate establishments first
      INSERT INTO formation_establishments 
      SELECT e.*
      FROM establishments e
      LEFT JOIN duplicate_links d ON e.lien = d.lien
      WHERE d.lien IS NULL OR e.id IN (
        SELECT primary_id FROM primary_establishments
      );

      -- Clean data
      UPDATE formation_establishments 
      SET lien = NULL 
      WHERE lien = 'Non Renseigné';

      UPDATE formation_establishments 
      SET tel = NULL 
      WHERE tel = 'Non Renseigné';

      UPDATE formation_establishments 
      SET facebook = NULL 
      WHERE facebook = '';

      UPDATE formation_establishments 
      SET instagram = NULL 
      WHERE instagram = '';

      UPDATE formation_establishments 
      SET linkedin = NULL 
      WHERE linkedin = '';

      -- Add constraints after cleaning
      CREATE UNIQUE INDEX formation_establishments_lien_key 
      ON formation_establishments (lien) 
      WHERE lien IS NOT NULL;

      CREATE UNIQUE INDEX formation_establishments_tel_key 
      ON formation_establishments (tel) 
      WHERE tel IS NOT NULL;

      -- Locations
      CREATE TABLE IF NOT EXISTS formation_locations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        ville text NOT NULL,
        region text NOT NULL,
        departement text NOT NULL,
        adresse text NOT NULL,
        created_at timestamp NOT NULL DEFAULT now()
      );

      -- Copy data first
      INSERT INTO formation_locations 
      SELECT * FROM locations;

      -- Clean data
      UPDATE formation_locations 
      SET ville = 'Ville ' || id::text 
      WHERE ville = 'Ville Non Renseignée';

      UPDATE formation_locations 
      SET region = 'Région ' || id::text 
      WHERE region = 'Région Non Renseignée';

      UPDATE formation_locations 
      SET departement = 'Département ' || id::text 
      WHERE departement = 'Département Non Renseigné';

      UPDATE formation_locations 
      SET adresse = 'Adresse ' || id::text 
      WHERE adresse = 'Adresse Non Renseignée';

      -- Add constraints after cleaning
      CREATE UNIQUE INDEX formation_locations_adresse_key 
      ON formation_locations (adresse);

      -- Costs
      CREATE TABLE IF NOT EXISTS formation_costs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        montant decimal NOT NULL,
        devise text DEFAULT 'EUR',
        gratuit_apprentissage boolean DEFAULT false,
        created_at timestamp NOT NULL DEFAULT now()
      );

      INSERT INTO formation_costs 
      SELECT * FROM costs;

      -- Pedagogy Types
      CREATE TABLE IF NOT EXISTS formation_pedagogy_types (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        temps_plein boolean DEFAULT false,
        presentiel boolean DEFAULT false,
        alternance boolean DEFAULT false,
        created_at timestamp NOT NULL DEFAULT now()
      );

      INSERT INTO formation_pedagogy_types 
      SELECT * FROM pedagogy_types;

      -- Finally Formations with foreign key constraints
      CREATE TABLE IF NOT EXISTS formation_formations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        formation text NOT NULL,
        etablissement_id uuid REFERENCES formation_establishments(id),
        location_id uuid REFERENCES formation_locations(id),
        niveau text NOT NULL,
        type text NOT NULL,
        domaines text[] NOT NULL,
        cost_id uuid REFERENCES formation_costs(id),
        duree text NOT NULL,
        pedagogy_id uuid REFERENCES formation_pedagogy_types(id),
        created_at timestamp NOT NULL DEFAULT now()
      );

      -- Insert formations, updating establishment references for duplicates
      INSERT INTO formation_formations
      SELECT f.id, f.formation,
        COALESCE(p.primary_id, f.etablissement_id) as etablissement_id,
        f.location_id, f.niveau, f.type, f.domaines,
        f.cost_id, f.duree, f.pedagogy_id, f.created_at
      FROM formations f
      LEFT JOIN establishments e ON f.etablissement_id = e.id
      LEFT JOIN primary_establishments p ON e.lien = p.lien;

      -- Drop temporary tables
      DROP TABLE duplicate_links;
      DROP TABLE primary_establishments;

      -- Drop old tables after successful migration
      DROP TABLE IF EXISTS formations CASCADE;
      DROP TABLE IF EXISTS establishments CASCADE;
      DROP TABLE IF EXISTS locations CASCADE;
      DROP TABLE IF EXISTS costs CASCADE;
      DROP TABLE IF EXISTS pedagogy_types CASCADE;

      -- Auth tables
      CREATE TABLE IF NOT EXISTS auth_users (
        id serial PRIMARY KEY,
        username text NOT NULL,
        email varchar(255) NOT NULL,
        password text NOT NULL,
        created_at timestamp NOT NULL DEFAULT now()
      );

      INSERT INTO auth_users 
      SELECT * FROM users;

      -- Add unique constraint after data migration
      CREATE UNIQUE INDEX auth_users_username_key 
      ON auth_users (username);

      -- Quiz tables
      CREATE TABLE IF NOT EXISTS quiz_temp_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamp NOT NULL DEFAULT now()
      );

      INSERT INTO quiz_temp_users 
      SELECT * FROM temp_users;

      -- Quiz Sessions
      CREATE TABLE IF NOT EXISTS quiz_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id integer REFERENCES auth_users(id),
        temp_user_id uuid REFERENCES quiz_temp_users(id),
        status text NOT NULL DEFAULT 'in_progress',
        current_question_id text,
        completed_questions jsonb NOT NULL DEFAULT '[]',
        answers jsonb NOT NULL DEFAULT '{}',
        started_at timestamp NOT NULL DEFAULT now(),
        last_updated timestamp NOT NULL DEFAULT now(),
        completed_at timestamp
      );

      INSERT INTO quiz_sessions 
      SELECT * FROM quiz_sessions;

      -- Quiz Results
      CREATE TABLE IF NOT EXISTS quiz_results (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id integer REFERENCES auth_users(id),
        temp_user_id uuid REFERENCES quiz_temp_users(id),
        session_id uuid REFERENCES quiz_sessions(id),
        answers jsonb NOT NULL,
        adaptive_flow jsonb NOT NULL,
        trait_scores jsonb NOT NULL,
        dominant_profile text NOT NULL,
        sub_profile text NOT NULL,
        traits jsonb NOT NULL,
        profile_match_scores jsonb NOT NULL,
        created_at timestamp NOT NULL DEFAULT now()
      );

      INSERT INTO quiz_results 
      SELECT * FROM quiz_results;

      -- Profile Completion
      CREATE TABLE IF NOT EXISTS quiz_profile_completion (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id integer REFERENCES auth_users(id) NOT NULL,
        basic_info_completed boolean DEFAULT false NOT NULL,
        traits_assessment_completed boolean DEFAULT false NOT NULL,
        personality_quiz_completed boolean DEFAULT false NOT NULL,
        interests_completed boolean DEFAULT false NOT NULL,
        education_prefs_completed boolean DEFAULT false NOT NULL,
        overall_progress decimal DEFAULT 0 NOT NULL,
        last_updated timestamp DEFAULT now() NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        CONSTRAINT quiz_profile_completion_user_id_key UNIQUE (user_id)
      );

      INSERT INTO quiz_profile_completion
      SELECT * FROM profile_completion;

      -- Drop old tables after successful migration
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS temp_users CASCADE;
      DROP TABLE IF EXISTS quiz_sessions CASCADE;
      DROP TABLE IF EXISTS quiz_results CASCADE;
      DROP TABLE IF EXISTS profile_completion CASCADE;
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

migrateTables().catch(console.error);