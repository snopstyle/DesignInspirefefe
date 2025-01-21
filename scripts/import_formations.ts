import { db } from '../db';
import { eq } from 'drizzle-orm';
import { formations, establishments, locations, costs, pedagogyTypes } from '../db/schema';
import xlsx from 'xlsx';
import path from 'path';

interface ExcelRow {
  Formation: string;
  'Type Formation': string;
  Domaines: string;
  Niveau: string;
  'Etablissement ': string;
  Statut: string;
  'Adresse ': string;
  Ville: string;
  'Département': string;
  'Région': string;
  Tel: string;
  Hébergement: string;
  'Durée ': string;
  'Pédagogie': string;
  'Coût': string;
  'Lien officiel': string;
  Facebook?: string;
  Instagram?: string;
  Linkedin?: string;
}

function formatText(text: string | undefined, defaultValue: string): string {
  if (!text || text.toLowerCase().includes('non renseigné')) return defaultValue;
  return text.trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function parseDomains(domainesText: string): string[] {
  if (!domainesText) return ['Non Renseigné'];

  return domainesText
    .split(/[,|/]/)
    .map(domain => formatText(domain, ''))
    .filter(domain => domain && domain !== '')
    .filter((domain, index, self) => self.indexOf(domain) === index);
}

function parseBoolean(text: string | undefined, defaultValue: boolean = false): boolean {
  if (!text) return defaultValue;
  const lowered = text.toLowerCase();
  if (lowered.includes('oui') || lowered.includes('yes')) return true;
  if (lowered.includes('non') || lowered.includes('no') || lowered.includes('sans')) return false;
  return defaultValue;
}

function parsePedagogyType(pedagogie: string): { tempsPlein: boolean; presentiel: boolean; alternance: boolean; } {
  const lowered = (pedagogie || '').toLowerCase();
  return {
    tempsPlein: lowered.includes('temps plein'),
    presentiel: lowered.includes('présentiel'),
    alternance: lowered.includes('alternance')
  };
}

function parseCost(cout: string): { montant: number; gratuitApprentissage: boolean; } {
  if (!cout) return { montant: 0, gratuitApprentissage: false };

  const montantMatch = cout.match(/(\d+(?:\s*\d+)*)/);
  const montant = montantMatch ? parseFloat(montantMatch[1].replace(/\s+/g, '')) : 0;
  const gratuitApprentissage = cout.toLowerCase().includes('gratuit') || cout.toLowerCase().includes('apprentissage');

  return { montant, gratuitApprentissage };
}

async function importFormations() {
  try {
    console.log('Starting import process...');
    const workbook = xlsx.readFile(path.join(process.cwd(), 'attached_assets/Top_250_Cities_Non_Public.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json<ExcelRow>(workbook.Sheets[sheetName]);

    console.log(`Found ${rawData.length} rows to import`);

    for (let i = 0; i < rawData.length; i += 10) {
      const batch = rawData.slice(i, i + 10);
      console.log(`Processing batch ${Math.floor(i / 10) + 1} of ${Math.ceil(rawData.length / 10)}`);

      for (const row of batch) {
        try {
          // Create or update establishment
          const [establishment] = await db
            .insert(establishments)
            .values({
              name: formatText(row['Etablissement '], 'Non Renseigné'),
              statut: formatText(row.Statut, 'Non Renseigné'),
              hebergement: parseBoolean(row.Hébergement),
              lien: row['Lien officiel'] || 'Non Renseigné',
              tel: row.Tel || 'Non Renseigné',
              facebook: row.Facebook || '',
              instagram: row.Instagram || '',
              linkedin: row.Linkedin || ''
            })
            .onConflictDoUpdate({
              target: establishments.name,
              set: {
                statut: formatText(row.Statut, 'Non Renseigné'),
                hebergement: parseBoolean(row.Hébergement),
                lien: row['Lien officiel'] || 'Non Renseigné',
                tel: row.Tel || 'Non Renseigné',
                facebook: row.Facebook || '',
                instagram: row.Instagram || '',
                linkedin: row.Linkedin || ''
              }
            })
            .returning();

          // Create location
          const [location] = await db
            .insert(locations)
            .values({
              ville: formatText(row.Ville, 'Non Renseigné'),
              region: formatText(row['Région'], 'Non Renseigné'),
              departement: formatText(row['Département'], 'Non Renseigné'),
              adresse: formatText(row['Adresse '], 'Non Renseigné')
            })
            .returning();

          // Create cost record
          const costInfo = parseCost(row['Coût']);
          const [cost] = await db
            .insert(costs)
            .values({
              montant: costInfo.montant,
              devise: 'EUR',
              gratuitApprentissage: costInfo.gratuitApprentissage
            })
            .returning();

          // Create pedagogy record
          const pedagogyInfo = parsePedagogyType(row['Pédagogie']);
          const [pedagogy] = await db
            .insert(pedagogyTypes)
            .values(pedagogyInfo)
            .returning();

          // Create formation with relations
          await db
            .insert(formations)
            .values({
              formation: formatText(row.Formation, 'Non Renseigné'),
              etablissementId: establishment.id,
              locationId: location.id,
              niveau: formatText(row.Niveau, 'Non Renseigné'),
              type: formatText(row['Type Formation'], 'Non Renseigné'),
              domaines: parseDomains(row.Domaines),
              costId: cost.id,
              duree: formatText(row['Durée '], 'Non Renseigné'),
              pedagogyId: pedagogy.id
            })
            .returning();

          console.log(`Imported formation: ${row.Formation}`);
        } catch (error) {
          console.error('Error processing row:', row);
          console.error('Error details:', error);
          // Continue with next item instead of stopping the entire import
        }
      }
    }

    console.log('Import completed successfully');
  } catch (err) {
    console.error('Error during import:', err);
    throw err;
  }
}

importFormations().catch(console.error);