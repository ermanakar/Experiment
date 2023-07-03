import logging
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import openai
import os
from book import book  # Import the book blueprint from book.py. Make sure it is in the same directory.

# Set up logging
logging.basicConfig(filename='app.log', level=logging.DEBUG)

app = Flask(__name__)
app.register_blueprint(book)  # Register the blueprint with your app.

CORS(app)  # This enables CORS for all routes

# Set OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

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
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=1500,
            temperature=1.0,
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

@app.route('/generate-podcast-questions', methods=['POST'])
def generate_podcast_questions():
    try:
        data = request.get_json()

        if not data:
            abort(400, description="No data provided")

        guest_name = data.get('guest_name')
        guest_background = data.get('guest_background')
        podcast_topic = data.get('podcast_topic')

        if not all([guest_name, guest_background, podcast_topic]):
            abort(400, description="Missing required data")

        messages = [
            {"role": "system", "content": f"You are a podcast host who is preparing to interview {guest_name}, who is {guest_background}."},
            {"role": "user", "content": f"The topic of the podcast is: {podcast_topic}"},
            {"role": "user", "content": "Can you help me generate some potential questions to ask during the interview?"},
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=100,
            temperature=0.9,
        )
        questions = response.choices[0].message['content'].strip()
    except Exception as e:
        logging.error("Exception occurred", exc_info=True)
        abort(500, description=str(e))

    return jsonify({"questions": questions})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)