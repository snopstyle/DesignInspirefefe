import json
import random
import pandas as pd
from pathlib import Path
import os
from datetime import datetime

def load_quiz_data():
    quiz_data_path = Path("client/src/lib/quiz-data.json")
    with open(quiz_data_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_random_answer(question):
    # For single choice questions
    if question['format'] == "Single choice":
        return random.choice(question['options'])

    # For multiple selection questions
    elif question['format'] == "Multiple selection":
        max_selections = question.get('maxSelections', len(question['options']))
        num_selections = random.randint(1, max_selections)
        return ", ".join(random.sample(question['options'], num_selections))

    # For ranking questions (maintain all options but in random order)
    elif question['format'] == "Drag-and-drop ranking":
        ranked_options = question['options'].copy()
        random.shuffle(ranked_options)
        return ", ".join(ranked_options)

    return "No answer"

def simulate_quiz_responses(num_users=10):
    try:
        quiz_data = load_quiz_data()
        questions = quiz_data['questions']

        # Initialize the dataframe structure
        data = []

        # Generate responses for each user
        for user_id in range(1, num_users + 1):
            user_responses = {'User ID': f'User_{user_id}'}

            # Generate answer for each question
            for question in questions:
                answer = generate_random_answer(question)
                user_responses[f"Q{question['id']}"] = answer

            data.append(user_responses)

        # Create DataFrame for responses
        df_responses = pd.DataFrame(data)

        # Create DataFrame for questions
        questions_data = [{
            'Question ID': f"Q{q['id']}", 
            'Section': q['section'],
            'Question': q['text'],
            'Format': q['format'],
            'Options': '; '.join(q['options'])
        } for q in questions]
        df_questions = pd.DataFrame(questions_data)

        # Save as CSV first (more compatible format)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        responses_csv = f'quiz_responses_{timestamp}.csv'
        questions_csv = f'quiz_questions_{timestamp}.csv'

        df_responses.to_csv(responses_csv, index=False, encoding='utf-8')
        df_questions.to_csv(questions_csv, index=False, encoding='utf-8')

        # Now create a simple Excel file
        output_path = f'quiz_data_{timestamp}.xlsx'
        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            # Use simpler options for better compatibility
            df_responses.to_excel(writer, sheet_name='Responses', index=False)
            df_questions.to_excel(writer, sheet_name='Questions', index=False)

        print(f"Generated quiz simulation data for {num_users} users")
        print(f"Files saved:")
        print(f"- Excel: {output_path}")
        print(f"- CSV (Responses): {responses_csv}")
        print(f"- CSV (Questions): {questions_csv}")

        # Print file sizes for verification
        print("\nFile sizes:")
        print(f"Excel: {os.path.getsize(output_path)} bytes")
        print(f"CSV (Responses): {os.path.getsize(responses_csv)} bytes")
        print(f"CSV (Questions): {os.path.getsize(questions_csv)} bytes")

        return output_path, responses_csv, questions_csv

    except Exception as e:
        print(f"Error generating quiz data: {str(e)}")
        return None

if __name__ == "__main__":
    simulate_quiz_responses(10)