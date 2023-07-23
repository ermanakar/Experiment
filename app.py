import logging
import os
import requests
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

logging.basicConfig(filename='app.log', level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv('OPENAI_API_KEY')

def get_book_info(author_name):
    author_name = author_name.replace(" ", "+")
    response = requests.get(f"https://www.googleapis.com/books/v1/volumes?q={author_name}&langRestrict=en")

    if response.status_code != 200:
        raise Exception(f"Request failed with status code {response.status_code}. Please try again.")
    data = response.json()
    books = data.get('items', [])
    book_info = []
    for book in books:
        volume_info = book.get('volumeInfo', {})
        title = volume_info.get('title', 'No title available')
        id = book.get('id', 'No ID available')
        subtitle = volume_info.get('subtitle', 'No subtitle available')
        authors = volume_info.get('authors', 'No authors available')
        publishedDate = volume_info.get('publishedDate', 'No publication date available')
        description = volume_info.get('description', 'No description available')
        pageCount = volume_info.get('pageCount', 'No page count available')
        book_info.append({'ID': id, 'Title': title, 'Subtitle': subtitle, 'Authors': authors, 'PublishedDate': publishedDate, 'Description': description, 'PageCount': pageCount})
    df = pd.DataFrame(book_info, columns=['ID', 'Title', 'Subtitle', 'Authors', 'PublishedDate', 'Description', 'PageCount'])
    return df

def get_single_book_info(book_id):
    response = requests.get(f"https://www.googleapis.com/books/v1/volumes/{book_id}")
    if response.status_code != 200:
        raise Exception(f"Request failed with status code {response.status_code}. Please try again.")
    book = response.json()
    volume_info = book.get('volumeInfo', {})
    title = volume_info.get('title', 'No title available')
    id = book.get('id', 'No ID available')
    subtitle = volume_info.get('subtitle', 'No subtitle available')
    authors = volume_info.get('authors', 'No authors available')
    publishedDate = volume_info.get('publishedDate', 'No publication date available')
    description = volume_info.get('description', 'No description available')
    pageCount = volume_info.get('pageCount', 'No page count available')
    book_info = {'ID': id, 'Title': title, 'Subtitle': subtitle, 'Authors': authors, 'PublishedDate': publishedDate, 'Description': description, 'PageCount': pageCount}
    return pd.DataFrame(book_info, index=[0])

def select_and_summarize_book(df):
    # Check if DataFrame is empty
    if df.empty:
        raise ValueError("Input DataFrame is empty")

    # Get the book details of the first book
    chosen_book = df.iloc[0]
    
    # Construct the system message with the book details
    system_message = {
        "role": "system",
        "content": f"You are the most knowledgeable librarian, capable of summarizing books. Title of the book is: '{chosen_book['Title']}' written by '{', '.join(chosen_book['Authors']) if isinstance(chosen_book['Authors'], list) else chosen_book['Authors']}' and its description: '{chosen_book['Description']}'"
    }
    
    # Define questions to guide the summarization process
    questions = [
        "Give the basic information about the book in the first paragraph", 
        "Give a short and distilled summary",
        "Give a bullet list of major events that happen in this book",
        "Explain why it is significant and finish with a quote from the book",
    ]
    
    # Build messages for OpenAI API request
    messages = [system_message]
    for question in questions:
        user_message = {"role": "user", "content": question}
        messages.append(user_message)
    
    try:
        # Request chat completion from OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=2048,
            temperature=0.7  
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        logging.error(f"Error occurred during OpenAI request: {e}")
        raise

@app.route('/get-books', methods=['POST'])
def get_books():
    author_name = request.json.get('author_name')
    try:
        df = get_book_info(author_name)
        return jsonify(df[:5].to_dict('records')), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get-summary', methods=['POST'])
def get_summary():
    book_id = request.json.get('book_id')
    try:
        df = get_single_book_info(book_id)   # use get_single_book_info() here
        if not df.empty:
            summary = select_and_summarize_book(df)
            return jsonify({'summary': summary}), 200
        else:
            return jsonify({'error': 'Book not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-prd', methods=['POST'])
def generate_prd():
    try:
        data = request.get_json()

        if not data:
            abort(400, description="No data provided")

        industry = data.get('industry')
        business_type = data.get('business_type')
        active_users = data.get('active_users')
        problem_statement = data.get('problem_statement')
        user_story = data.get('user_story')

        if not all([industry, business_type, active_users, problem_statement, user_story]):
            abort(400, description="Missing required data")

        messages = [
            {"role": "system", "content": f"You are a experienced Product Manager specialising in building digital products in {industry} industry"},
            {"role": "user", "content": f"We are a {business_type} company with {active_users} monthly active users."},
            {"role": "user", "content": f"Problem Statement: {problem_statement}"},
            {"role": "user", "content": f"The feature described by our user story is: {user_story}"},
            {"role": "user", "content": "Please provide a detailed Product Requirements Document for this feature?"},
        ]

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=3000,
            temperature=0.8,
        )
        prd = response.choices[0].message['content'].strip()
    except Exception as e:
        logging.error("Exception occurred", exc_info=True)
        abort(500, description=str(e))

    return jsonify({"prd": prd})

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    try:
        data = request.get_json()

        if not data:
            abort(400, description="No data provided")

        job_title = data.get('job_title')
        skills = data.get('skills')
        experience = data.get('experience')
        company = data.get('company')

        if not all([job_title, skills, experience, company]):
            abort(400, description="Missing required data")

        prompt = f"""
        We have a candidate for the {job_title} position at {company}. 
        This candidate has proficiency in the following skills: {skills}. 
        Additionally, they have a total of {experience} years of work experience in relevant fields. 
        Please generate a list of specific interview questions that can assess their technical expertise and interpersonal abilities. 
        """

        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=200,
            temperature=0.9,
        )
        questions = response.choices[0].text.strip()
    except Exception as e:
        logging.error("Exception occurred", exc_info=True)
        abort(500, description=str(e))

    return jsonify({"questions": questions})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)