import pandas as pd
import json
from pathlib import Path

def parse_answer_options(options_str):
    if pd.isna(options_str):
        return []

    # First split by newlines
    options = str(options_str).split('\n')

    # For each option, further split by "-" if present
    expanded_options = []
    for opt in options:
        if '-' in opt:
            # Split by "-" and add each part
            parts = [p.strip() for p in opt.split('-')]
            expanded_options.extend(parts)
        else:
            expanded_options.append(opt.strip())

    # Clean up options: remove empty strings and whitespace
    cleaned_options = [opt for opt in expanded_options if opt and not opt.isspace()]

    return cleaned_options

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

            # Parse answer options using the new function
            options = parse_answer_options(row['Answer Options'])

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

        # Print first few questions' options to verify parsing
        print("\nSample of parsed questions:")
        for q in questions[:3]:
            print(f"\nQ{q['id']}: {q['text']}")
            print("Options:", q['options'])

        return True
    except Exception as e:
        print(f"Error parsing Excel file: {str(e)}")
        return False

if __name__ == "__main__":
    parse_quiz_excel()