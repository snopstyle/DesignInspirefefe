
import { db } from '../db';
import { formations, establishments, locations, costs, pedagogyTypes } from '../db/schema';
import xlsx from 'xlsx';
import path from 'path';

async function importFormations() {
  try {
    const workbook = xlsx.readFile(path.join(process.cwd(), 'attached_assets/Top_250_Cities_Non_Public.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const item of rawData) {
      // Create establishment record
      const establishment = await db.insert(establishments).values({
        name: item['Etablissement'] || 'Établissement non renseigné',
        statut: item['Statut'] || 'Statut non renseigné',
        hebergement: Boolean(item['Hébergement']),
        lien: item['Lien'] || 'Non renseigné',
        tel: item['Téléphone'] || 'Non renseigné',
        facebook: item['Facebook'] || '',
        instagram: item['Instagram'] || '',
        linkedin: item['LinkedIn'] || ''
      }).returning();

      // Create location record
      const location = await db.insert(locations).values({
        ville: item['Ville'] || 'Ville non renseignée',
        region: item['Région'] || 'Région non renseignée',
        departement: item['Département'] || 'Département non renseigné',
        adresse: item['Adresse'] || 'Adresse non renseignée'
      }).returning();

      // Create cost record
      const cost = await db.insert(costs).values({
        montant: parseInt(item['Coût']?.match(/\d+/)?.[0] || '0'),
        devise: 'EUR',
        gratuitApprentissage: /gratuit|apprentissage/i.test(item['Coût'] || '')
      }).returning();

      // Create pedagogy record
      const pedagogy = await db.insert(pedagogyTypes).values({
        tempsPlein: /temps.*plein/i.test(item['Pédagogie'] || ''),
        presentiel: /présentiel/i.test(item['Pédagogie'] || ''),
        alternance: /alternance/i.test(item['Pédagogie'] || '')
      }).returning();

      // Create formation with relations
      await db.insert(formations).values({
        formation: item['Formation'] || 'Formation non renseignée',
        etablissementId: establishment[0].id,
        locationId: location[0].id,
        niveau: item['Niveau'] || 'Niveau non renseigné',
        type: item['Type de Formation'] || 'Type non renseigné',
        domaines: item['Domaines'] ? item['Domaines'].split(',').map((d: string) => d.trim()) : ['Domaine non renseigné'],
        costId: cost[0].id,
        duree: item['Durée'] || 'Durée non renseignée',
        pedagogyId: pedagogy[0].id
      });
    }

    console.log('Import completed successfully');
  } catch (err) {
    console.error('Error during import:', err);
  }
}

importFormations();
