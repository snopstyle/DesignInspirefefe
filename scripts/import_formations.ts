import { db } from '../db';
import { formations, establishments, locations, costs, pedagogyTypes } from '../db/schema';
import xlsx from 'xlsx';
import path from 'path';

interface ExcelRow {
  Formation: string;
  Etablissement: string;
  Statut: string;
  Hébergement: boolean;
  Lien: string;
  Téléphone: string;
  Facebook: string;
  Instagram: string;
  LinkedIn: string;
  Ville: string;
  Région: string;
  Département: string;
  Adresse: string;
  Coût: string;
  Pédagogie: string;
  Niveau: string;
  'Type de Formation': string;
  Domaines: string;
  Durée: string;
}

const BATCH_SIZE = 10;

async function importFormations() {
  try {
    const workbook = xlsx.readFile(path.join(process.cwd(), 'attached_assets/Top_250_Cities_Non_Public.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json<ExcelRow>(workbook.Sheets[sheetName]);

    console.log(`Found ${rawData.length} rows to import`);

    // Process in batches
    for (let i = 0; i < rawData.length; i += BATCH_SIZE) {
      const batch = rawData.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(rawData.length / BATCH_SIZE)}`);

      await Promise.all(batch.map(async (item) => {
        try {
          // Create establishment record
          const [establishment] = await db.insert(establishments).values({
            name: item.Etablissement || 'Établissement non renseigné',
            statut: item.Statut || 'Statut non renseigné',
            hebergement: Boolean(item.Hébergement),
            lien: item.Lien || 'Non renseigné',
            tel: item.Téléphone || 'Non renseigné',
            facebook: item.Facebook || '',
            instagram: item.Instagram || '',
            linkedin: item.LinkedIn || ''
          }).returning();

          // Create location record
          const [location] = await db.insert(locations).values({
            ville: item.Ville || 'Ville non renseignée',
            region: item.Région || 'Région non renseignée',
            departement: item.Département || 'Département non renseigné',
            adresse: item.Adresse || 'Adresse non renseignée'
          }).returning();

          // Create cost record
          const montantMatch = (item.Coût || '0').match(/\d+/);
          const [cost] = await db.insert(costs).values({
            montant: montantMatch ? parseFloat(montantMatch[0]) : 0,
            devise: 'EUR',
            gratuitApprentissage: /gratuit|apprentissage/i.test(item.Coût || '')
          }).returning();

          // Create pedagogy record
          const [pedagogy] = await db.insert(pedagogyTypes).values({
            tempsPlein: /temps.*plein/i.test(item.Pédagogie || ''),
            presentiel: /présentiel/i.test(item.Pédagogie || ''),
            alternance: /alternance/i.test(item.Pédagogie || '')
          }).returning();

          // Create formation with relations
          await db.insert(formations).values({
            formation: item.Formation || 'Formation non renseignée',
            etablissementId: establishment.id,
            locationId: location.id,
            niveau: item.Niveau || 'Niveau non renseigné',
            type: item['Type de Formation'] || 'Type non renseigné',
            domaines: item.Domaines ? item.Domaines.split(',').map(d => d.trim()) : ['Domaine non renseigné'],
            costId: cost.id,
            duree: item.Durée || 'Durée non renseignée',
            pedagogyId: pedagogy.id
          });

        } catch (error) {
          console.error('Error processing row:', item);
          console.error('Error details:', error);
          // Continue with next item instead of stopping the entire import
          return;
        }
      }));

      console.log(`Completed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    }

    console.log('Import completed successfully');
  } catch (err) {
    console.error('Error during import:', err);
    throw err;
  }
}

importFormations().catch(console.error);