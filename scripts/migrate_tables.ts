import { db } from "../db";
import { sql } from "drizzle-orm";

async function migrateTables() {
  try {
    console.log('Starting table migration...');

    // Formation tables migration
    console.log('Migrating formation tables...');
    await db.execute(sql`
      -- Create new establishments table with institution support
      CREATE TABLE IF NOT EXISTS formation_establishments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        statut text NOT NULL,
        hebergement boolean DEFAULT false,
        institution_name text,  -- Name of the parent institution
        institution_website text, -- Website of the parent institution
        campus_name text,      -- Specific campus/location name
        tel text,
        facebook text,
        instagram text,
        linkedin text,
        created_at timestamp NOT NULL DEFAULT now()
      );

      -- Extract institution names and websites
      WITH establishments_parsed AS (
        SELECT 
          e.*,
          CASE 
            WHEN lien != 'Non Renseigné' THEN
              SPLIT_PART(
                REGEXP_REPLACE(
                  name, 
                  '- Campus.*|, Site.*', 
                  ''
                ),
                ' - ',
                1
              )
            ELSE name
          END as institution_name,
          NULLIF(lien, 'Non Renseigné') as institution_website,
          CASE 
            WHEN name ~ '- Campus.*|, Site.*' 
            THEN REGEXP_REPLACE(
              name, 
              '.*?(- Campus|, Site)(.*)', 
              '\2'
            )
          END as campus_name
        FROM establishments e
      )
      INSERT INTO formation_establishments (
        id,
        name,
        statut,
        hebergement,
        institution_name,
        institution_website,
        campus_name,
        tel,
        facebook,
        instagram,
        linkedin,
        created_at
      )
      SELECT 
        id,
        name,
        statut,
        hebergement,
        institution_name,
        institution_website,
        campus_name,
        NULLIF(tel, 'Non Renseigné'),
        NULLIF(facebook, ''),
        NULLIF(instagram, ''),
        NULLIF(linkedin, ''),
        created_at
      FROM establishments_parsed;

      -- Locations table
      CREATE TABLE IF NOT EXISTS formation_locations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        ville text NOT NULL,
        region text NOT NULL,
        departement text NOT NULL,
        adresse text NOT NULL,
        created_at timestamp NOT NULL DEFAULT now()
      );

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

      -- Add constraints for locations
      CREATE UNIQUE INDEX IF NOT EXISTS formation_locations_adresse_key 
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

      -- Formations
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

      -- Direct copy of formations with same establishment references
      INSERT INTO formation_formations
      SELECT * FROM formations;

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

    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

migrateTables().catch(console.error);