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

// Helper function to properly format text
function formatText(text: string, defaultValue: string): string {
  if (!text) return defaultValue;
  return text.trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

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
            name: formatText(item.Etablissement, 'Établissement Non Renseigné'),
            statut: formatText(item.Statut, 'Statut Non Renseigné'),
            hebergement: Boolean(item.Hébergement),
            lien: item.Lien || 'Non Renseigné',
            tel: item.Téléphone || 'Non Renseigné',
            facebook: item.Facebook || '',
            instagram: item.Instagram || '',
            linkedin: item.LinkedIn || ''
          }).returning();

          // Create location record
          const [location] = await db.insert(locations).values({
            ville: formatText(item.Ville, 'Ville Non Renseignée'),
            region: formatText(item.Région, 'Région Non Renseignée'),
            departement: formatText(item.Département, 'Département Non Renseigné'),
            adresse: formatText(item.Adresse, 'Adresse Non Renseignée')
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
            formation: formatText(item.Formation, 'Formation Non Renseignée'),
            etablissementId: establishment.id,
            locationId: location.id,
            niveau: formatText(item.Niveau, 'Niveau Non Renseigné'),
            type: formatText(item['Type de Formation'], 'Type de Formation Non Renseigné'),
            domaines: item.Domaines ? 
              item.Domaines.split(',')
                .map(d => formatText(d, ''))
                .filter(d => d !== '') : ['Domaine Non Renseigné'],
            costId: cost.id,
            duree: formatText(item.Durée, 'Durée Non Renseignée'),
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