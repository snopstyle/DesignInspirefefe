
import { db } from '../db';
import { formations } from '../db/schema';
import xlsx from 'xlsx';
import path from 'path';

async function importFormations() {
  try {
    const workbook = xlsx.readFile(path.join(process.cwd(), 'attached_assets/Top_250_Cities_Non_Public.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const item of rawData) {
      await db.insert(formations).values({
        formation: item['Formation'] || 'Formation non renseignée',
        etablissement: item['Etablissement'] || 'Établissement non renseigné',
        ville: item['Ville'] || 'Ville non renseignée',
        region: item['Région'] || 'Région non renseignée',
        niveau: item['Niveau'] || 'Niveau non renseigné',
        type: item['Type de Formation'] || 'Type non renseigné',
        domaines: item['Domaines'] ? item['Domaines'].split(',').map((d: string) => d.trim()) : ['Domaine non renseigné'],
        cout: {
          montant: parseInt(item['Coût']?.match(/\d+/)?.[0] || '0'),
          devise: 'EUR',
          gratuitApprentissage: /gratuit|apprentissage/i.test(item['Coût'] || '')
        },
        duree: item['Durée'] || 'Durée non renseignée',
        pedagogie: {
          tempsPlein: /temps.*plein/i.test(item['Pédagogie'] || ''),
          presentiel: /présentiel/i.test(item['Pédagogie'] || ''),
          alternance: /alternance/i.test(item['Pédagogie'] || '')
        },
        statut: item['Statut'] || 'Statut non renseigné',
        hebergement: Boolean(item['Hébergement']),
        lien: item['Lien'] || 'Non renseigné',
        adresse: item['Adresse'] || 'Adresse non renseignée',
        departement: item['Département'] || 'Département non renseigné',
        tel: item['Téléphone'] || 'Non renseigné',
        facebook: item['Facebook'] || '',
        instagram: item['Instagram'] || '',
        linkedin: item['LinkedIn'] || ''
      });
    }
    
    console.log('Import terminé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
  }
}

importFormations();
