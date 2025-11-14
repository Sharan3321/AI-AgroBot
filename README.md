# AI-AgroBot

**An intelligent agricultural chatbot powered by AI to assist farmers with crop management, pest control, soil health, and farming recommendations.**

## About

AI-AgroBot is a Flask-based web application that provides:
- AI-powered farming advice using OpenAI GPT
- Multi-language support (English, Hindi, Tamil, etc.)
- Image analysis for crop/pest identification
- Voice input for queries
- Chat history tracking
- User profiles with personalized recommendations
- Admin dashboard for user management

## Tech Stack

- **Backend**: Python, Flask, SQLAlchemy
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite
- **AI**: OpenAI API, LangDetect, GoogleTrans
- **Security**: Flask-Login, Werkzeug

## Installation

### Prerequisites
- Python 3.8+
- OpenAI API Key

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/Sharan3321/AI-AgroBot.git
cd AI-AgroBot
```

2. **Create virtual environment**
```bash
python -m venv venv
venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set environment variables**
Create a `.env` file:
```env
FLASK_SECRET_KEY=your_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

5. **Initialize database**
```bash
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

## How to Run

1. **Activate virtual environment**
```bash
venv\Scripts\activate
```

2. **Run the application**
```bash
python app.py
```

3. **Open browser**
Navigate to `http://localhost:5000`

## Default Admin Login
- Email: `admin@agro.com`
- Password: `admin123`
