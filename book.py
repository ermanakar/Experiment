from flask import Blueprint, request, jsonify, abort, Flask
import os
import requests
import pandas as pd
import openai

# Create a blueprint
book = Blueprint('book', __name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://shopofluba.de"}})  # This restricts CORS to a specific origin

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')


def get_book_info(author_name):
    author_name = author_name.replace(" ", "+")
    response = requests.get(f"https://www.googleapis.com/books/v1/volumes?q=author:{author_name}&langRestrict=en")
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
        averageRating = volume_info.get('averageRating', 0)
        ratingsCount = volume_info.get('ratingsCount', 0)
        book_info.append({'ID': id, 'Title': title, 'Subtitle': subtitle, 'Authors': authors, 'PublishedDate': publishedDate, 'Description': description, 'PageCount': pageCount, 'AverageRating': averageRating, 'RatingsCount': ratingsCount})
    df = pd.DataFrame(book_info, columns=['ID', 'Title', 'Subtitle', 'Authors', 'PublishedDate', 'Description', 'PageCount', 'AverageRating', 'RatingsCount'])
    df = df.sort_values(by=['RatingsCount', 'AverageRating'], ascending=[False, False])
    return df

def select_and_summarize_book(df):
    top_books = df[:min(5, len(df))]
    chosen_book = top_books.iloc[0]  # I'm just automatically choosing the first book here
    system_message = {"role": "system", "content": f"You are the most knowledgeable librarian, capable of summarizing books. Title of the book is: '{chosen_book['Title']}' written by '{', '.join(chosen_book['Authors']) if isinstance(chosen_book['Authors'], list) else chosen_book['Authors']}' and its description: '{chosen_book['Description']}'"}
    questions = [
        "Give the basic information about the book in the first paragraph", 
        "Give a short and distilled summary",
        "Give a bullet list of major events that happen in this book",
        "Explain why it is significant and finish with a quote from the book",
    ]
    messages = [system_message]
    for question in questions:
        user_message = {"role": "user", "content": question}
        messages.append(user_message)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        max_tokens=2048,
        temperature=1.0  
    )
    return response['choices'][0]['message']['content'].strip()

@app.route('/generate-book-summary', methods=['POST'])
def generate_book_summary():
    try:
        data = request.get_json()

        if not data:
            abort(400, description="No data provided")

        author_name = data.get('author_name')

        if not author_name:
            abort(400, description="No author name provided")

        df = get_book_info(author_name)
        summary = select_and_summarize_book(df)

        return jsonify({'summary': summary})
    except Exception as e:
        abort(500, description=str(e))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
