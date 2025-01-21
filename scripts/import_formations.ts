import { db } from '../db';
import { eq } from 'drizzle-orm';
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

// Helper function to properly format text
function formatText(text: string, defaultValue: string): string {
  if (!text) return defaultValue;
  return text.trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to determine establishment name
function getEstablishmentName(formation: string, etablissement: string): string {
  // If etablissement is provided and not "non renseigné", use it
  if (etablissement && !etablissement.toLowerCase().includes('non renseigné')) {
    return formatText(etablissement, '');
  }

  // Check formation name for institution patterns
  const formationLower = formation.toLowerCase();

  // Universities and Institutes
  if (formationLower.includes('iae')) {
    return 'IAE - Institut d\'Administration des Entreprises';
  }
  if (formationLower.includes('iut')) {
    return 'IUT - Institut Universitaire de Technologie';
  }

  // Business Schools Pattern Detection
  const businessSchools = {
    'escp': 'ESCP Business School',
    'essec': 'ESSEC Business School',
    'edhec': 'EDHEC Business School',
    'emlyon': 'EMLYON Business School',
    'em lyon': 'EMLYON Business School',
    'kedge': 'KEDGE Business School',
    'neoma': 'NEOMA Business School',
    'skema': 'SKEMA Business School',
    'icn': 'ICN Business School',
    'ipag': 'IPAG Business School',
    'idrac': 'IDRAC Business School',
    'inseec': 'INSEEC Business School',
    'novancia': 'Novancia Business School',
    'audencia': 'Audencia Business School',
    'sup de co': 'École Supérieure de Commerce'
  };

  for (const [key, value] of Object.entries(businessSchools)) {
    if (formationLower.includes(key)) {
      return value;
    }
  }

  // Special case for HEC (must be after EDHEC check)
  if (formationLower.includes('hec') && !formationLower.includes('edhec')) {
    return 'HEC Paris';
  }

  // Engineering Schools
  const engineeringSchools = {
    'ensam': 'Arts et Métiers ParisTech',
    'arts et métiers': 'Arts et Métiers ParisTech',
    'ensea': 'ENSEA',
    'supélec': 'CentraleSupélec',
    'supelec': 'CentraleSupélec',
    'centrale': 'CentraleSupélec',
    'polytechnique': 'École Polytechnique',
    'mines': 'École des Mines',
    'insa': 'INSA',
    'enac': 'ENAC',
    'ensai': 'ENSAI',
    'ensi': 'ENSI',
    'esiee': 'ESIEE',
    'epitech': 'Epitech',
    'epita': 'EPITA',
    'isep': 'ISEP',
    'esiea': 'ESIEA',
    'efrei': 'EFREI',
    'epsi': 'EPSI - École d\'Ingénierie Informatique'
  };

  for (const [key, value] of Object.entries(engineeringSchools)) {
    if (formationLower.includes(key)) {
      return value;
    }
  }

  // Specialized Schools
  const specializedSchools = {
    'esmod': 'ESMOD',
    'iscom': 'ISCOM',
    'sup de pub': 'SUP DE PUB',
    'sup career': 'SUP CAREER',
    'sciences u': 'SCIENCES-U',
    'isfj': 'ISFJ',
    'amos': 'AMOS Sport Business School',
    'isefac': 'ISEFAC',
    'esg': 'ESG',
    'esj': 'ESJ',
    'iscpa': 'ISCPA',
    '3is': '3IS',
    'lisaa': 'LISAA',
    'talis': 'École Talis',
    'anaten': 'École Anaten',
    'icp': 'Institut Catholique de Paris',
    'igr': 'IGR-IAE',
    'excelia': 'Excelia Business School'
  };

  for (const [key, value] of Object.entries(specializedSchools)) {
    if (formationLower.includes(key)) {
      return value;
    }
  }

  // Other Educational Institutions
  if (formationLower.includes('cnam')) {
    return 'CNAM';
  }
  if (formationLower.includes('greta')) {
    return 'GRETA';
  }

  // Generic Degree-based Classification
  if (formationLower.includes('master')) {
    const domainMatch = formationLower.match(/master.*(finance|gestion|commerce|marketing|communication|informatique|management)/);
    if (domainMatch) {
      return `École Supérieure de ${domainMatch[1].charAt(0).toUpperCase() + domainMatch[1].slice(1)}`;
    }
    return 'École Supérieure';
  }
  if (formationLower.includes('mba')) {
    return 'École de Management';
  }
  if (formationLower.includes('bachelor')) {
    return 'École Supérieure';
  }
  if (formationLower.includes('bts')) {
    return 'Lycée - Section BTS';
  }
  if (formationLower.includes('licence') || formationLower.includes('bachelor')) {
    return 'École Supérieure';
  }

  // Field-based Classification
  if (formationLower.includes('commerce') || formationLower.includes('gestion')) {
    return 'École de Commerce et Gestion';
  }
  if (formationLower.includes('art') || formationLower.includes('design')) {
    return 'École d\'Art et Design';
  }
  if (formationLower.includes('informatique') || formationLower.includes('numérique')) {
    return 'École d\'Informatique';
  }
  if (formationLower.includes('communication') || formationLower.includes('journalisme')) {
    return 'École de Communication';
  }

  // Default case - use a more specific classification
  return 'École Supérieure';
}

// Helper function to parse and format domains
function parseDomains(domainsText: string): string[] {
  if (!domainsText) return ['Domaine Non Renseigné'];

  return domainsText
    .split(/[,|]/) // Split on comma OR vertical bar
    .map(domain => formatText(domain, ''))
    .filter(domain => domain !== '')
    .filter((domain, index, self) => self.indexOf(domain) === index); // Remove duplicates
}

async function importFormations() {
  try {
    console.log('Starting import process...');
    const workbook = xlsx.readFile(path.join(process.cwd(), 'attached_assets/Top_250_Cities_Non_Public.xlsx'));
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json<ExcelRow>(workbook.Sheets[sheetName]);

    console.log(`Found ${rawData.length} rows to import`);

    // Process in batches
    for (let i = 0; i < rawData.length; i += 10) {
      const batch = rawData.slice(i, i + 10);
      console.log(`Processing batch ${Math.floor(i / 10) + 1} of ${Math.ceil(rawData.length / 10)}`);

      for (const item of batch) {
        try {
          // Get establishment name using the enhanced logic
          const establishmentName = getEstablishmentName(item.Formation, item.Etablissement);
          console.log(`Determined establishment name: ${establishmentName} for formation: ${item.Formation}`);

          // Create establishment record
          const [establishment] = await db
            .insert(establishments)
            .values({
              name: establishmentName,
              statut: formatText(item.Statut, 'Statut Non Renseigné'),
              hebergement: Boolean(item.Hébergement),
              lien: item.Lien || 'Non Renseigné',
              tel: item.Téléphone || 'Non Renseigné',
              facebook: item.Facebook || '',
              instagram: item.Instagram || '',
              linkedin: item.LinkedIn || ''
            })
            .onConflictDoNothing({
              target: [establishments.name],
            })
            .returning();

          let establishmentRecord = establishment;
          if (!establishmentRecord) {
            // If no establishment was inserted, fetch the existing one
            const [existingEstablishment] = await db
              .select()
              .from(establishments)
              .where(eq(establishments.name, establishmentName))
              .limit(1);

            if (existingEstablishment) {
              establishmentRecord = existingEstablishment;
            } else {
              console.error(`Failed to get establishment: ${establishmentName}`);
              continue;
            }
          }

          // Create location record
          const [location] = await db
            .insert(locations)
            .values({
              ville: formatText(item.Ville, 'Ville Non Renseignée'),
              region: formatText(item.Région, 'Région Non Renseignée'),
              departement: formatText(item.Département, 'Département Non Renseigné'),
              adresse: formatText(item.Adresse, 'Adresse Non Renseignée')
            })
            .returning();

          // Create cost record with better parsing
          const montantMatch = (item.Coût || '0').match(/\d+/);
          const [cost] = await db
            .insert(costs)
            .values({
              montant: montantMatch ? parseFloat(montantMatch[0]) : 0,
              devise: 'EUR',
              gratuitApprentissage: /gratuit|apprentissage/i.test(item.Coût || '')
            })
            .returning();

          // Create pedagogy record
          const [pedagogy] = await db
            .insert(pedagogyTypes)
            .values({
              tempsPlein: /temps.*plein/i.test(item.Pédagogie || ''),
              presentiel: /présentiel/i.test(item.Pédagogie || ''),
              alternance: /alternance/i.test(item.Pédagogie || '')
            })
            .returning();

          // Create formation with relations
          await db
            .insert(formations)
            .values({
              formation: formatText(item.Formation, 'Formation Non Renseignée'),
              etablissementId: establishmentRecord.id,
              locationId: location.id,
              niveau: formatText(item.Niveau, 'Niveau Non Renseigné'),
              type: formatText(item['Type de Formation'], 'Type de Formation Non Renseigné'),
              domaines: parseDomains(item.Domaines),
              costId: cost.id,
              duree: formatText(item.Durée, 'Durée Non Renseignée'),
              pedagogyId: pedagogy.id
            });

        } catch (error) {
          console.error('Error processing row:', item);
          console.error('Error details:', error);
          // Continue with next item instead of stopping the entire import
        }
      }

      console.log(`Completed batch ${Math.floor(i / 10) + 1}`);
    }

    console.log('Import completed successfully');
  } catch (err) {
    console.error('Error during import:', err);
    throw err;
  }
}

importFormations().catch(console.error);