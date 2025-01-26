
import pandas as pd
import json
from collections import Counter

def analyze_quiz_responses(file_path):
    # Lire le fichier Excel
    df = pd.read_excel(file_path)
    
    # Analyser chaque réponse
    profiles = []
    
    for _, row in df.iterrows():
        # Convertir les réponses en format attendu
        answers = {f"Q{i}": str(val) for i, val in enumerate(row[1:], 1) if pd.notna(val)}
        
        # Calculer le profil
        # Ici nous comptons juste le profil dominant retourné
        profile = row.get('Profil_Dominant', 'Non déterminé')
        profiles.append(profile)
    
    # Compter les occurrences de chaque profil
    profile_counts = Counter(profiles)
    
    # Afficher les résultats
    print("\nRépartition des profils:")
    for profile, count in profile_counts.most_common():
        percentage = (count / len(profiles)) * 100
        print(f"{profile}: {count} utilisateurs ({percentage:.1f}%)")

    return profile_counts

if __name__ == "__main__":
    analyze_quiz_responses("attached_assets/simulated_user_responses.xlsx")
