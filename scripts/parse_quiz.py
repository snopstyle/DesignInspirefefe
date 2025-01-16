import pandas as pd
import json
from pathlib import Path

def parse_quiz_excel():
    # Read the Excel file
    excel_path = Path("attached_assets/QUIZ POOL.xlsx")
    try:
        df = pd.read_excel(excel_path)

        # Fill forward the section names (replace NaN with previous valid section)
        df['Section'] = df['Section'].ffill()

        # Convert DataFrame to structured question format
        questions = []
        for _, row in df.iterrows():
            # Skip rows with missing essential data
            if pd.isna(row['Question Text']):
                continue

            # Extract numeric part from Question ID (e.g., 'Q1' -> 1)
            try:
                question_id = int(''.join(filter(str.isdigit, str(row['Question ID']))))
            except ValueError:
                continue

            # Parse answer options from the string representation
            options = []
            if pd.notna(row['Answer Options']):
                options = [opt.strip() for opt in str(row['Answer Options']).split(';')]
                options = [opt for opt in options if opt]  # Remove empty options

            # Create question object
            question = {
                'id': question_id,
                'section': str(row['Section']).strip(),
                'text': str(row['Question Text']).strip(),
                'options': options,
                'format': str(row['Format type']).strip() if pd.notna(row['Format type']) else "Single choice"
            }
            questions.append(question)

        # Sort questions by ID to ensure proper order
        questions.sort(key=lambda x: x['id'])

        # Save as JSON for easy import into TypeScript
        with open('client/src/lib/quiz-data.json', 'w', encoding='utf-8') as f:
            json.dump({'questions': questions}, f, indent=2, ensure_ascii=False)

        print("Successfully parsed quiz data:")
        print(f"Total questions: {len(questions)}")
        print("\nSections found:")
        for section in df['Section'].unique():
            if pd.notna(section):
                count = len(df[df['Section'] == section])
                print(f"- {section}: {count} questions")

        return True
    except Exception as e:
        print(f"Error parsing Excel file: {str(e)}")
        return False

if __name__ == "__main__":
    parse_quiz_excel()