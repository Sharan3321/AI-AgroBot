# AI-AgroBot Quick Start Guide

## 🚀 Quick Installation (5 minutes)

### For Windows Users

1. **Install Python** (if not installed)
   - Download from https://www.python.org/downloads/
   - Check "Add Python to PATH" during installation
   - Verify: Open Command Prompt and type `python --version`

2. **Download the Project**
   ```bash
   git clone https://github.com/yourusername/ai-agrobot.git
   cd ai-agrobot
   ```

3. **Setup Virtual Environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to `.env`

6. **Run the Application**
   ```bash
   python app.py
   ```

7. **Open Browser**
   - Navigate to `http://localhost:5000`
   - Register a new account or use admin credentials

### For macOS/Linux Users

```bash
# Clone repository
git clone https://github.com/yourusername/ai-agrobot.git
cd ai-agrobot

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your OpenAI API key

# Run application
python app.py
```

## 🎯 First Steps After Installation

1. **Create Admin Account** (if not auto-created)
   - Email: admin@agro.com
   - Password: admin123
   - ⚠️ Change this immediately in production!

2. **Test the Chatbot**
   - Register a regular user account
   - Go to Chat interface
   - Try asking: "What is the best fertilizer for tomatoes?"

3. **Upload Knowledge Base** (Optional)
   - Login as admin
   - Go to Admin Dashboard
   - Upload CSV files with agricultural data

## 🔧 Common Issues & Solutions

### Issue: "ModuleNotFoundError"
**Solution**: Make sure virtual environment is activated
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Issue: "OpenAI API Error"
**Solution**: Check your API key in `.env` file
- Get key from: https://platform.openai.com/api-keys
- Ensure you have credits in your OpenAI account

### Issue: "Database Error"
**Solution**: Initialize the database
```python
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

### Issue: "Port 5000 already in use"
**Solution**: Change port in `app.py`
```python
if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Use different port
```

## 📱 Testing Features

### Test Voice Input
1. Click the 🎤 microphone button
2. Allow browser microphone access
3. Speak your question clearly
4. Wait for response

### Test Image Upload
1. Click the 📷 camera button
2. Select a crop/pest image
3. Wait for AI analysis
4. View detailed response

### Test Multi-Language
1. Go to Profile
2. Change Preferred Language to Hindi/Tamil
3. Ask questions in your language
4. Receive translated responses

## 🎨 Customization Quick Tips

### Change Primary Color
Edit `static/style.css`:
```css
:root {
    --brand: #16a34a;  /* Your preferred color */
}
```

### Add New Quick Suggestion
Edit `templates/index.html`, find suggestion buttons:
```html
<button onclick="document.getElementById('msg').value='Your Question'; document.getElementById('sendBtn').click();">
    🌱 Your Suggestion
</button>
```

### Modify Landing Page Text
Edit `templates/landing.html`:
```html
<h1 class="hero-title">Your Custom Title</h1>
```

## 📊 Understanding the Dashboard

### User Dashboard Shows:
- Total messages sent
- Chat history
- Profile information
- Quick access to features

### Admin Dashboard Shows:
- Total registered users
- Recent users
- System statistics
- Knowledge base management

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It contains secrets
2. **Change default admin password** immediately
3. **Use strong SECRET_KEY** in production
4. **Enable HTTPS** for production deployment
5. **Regularly update dependencies**

## 📚 Next Steps

- Read the full [README.md](README.md)
- Check [CONFIG.md](CONFIG.md) for advanced setup
- Explore the code in `app.py` and `chatbot_model.py`
- Join our community for support

## 🆘 Getting Help

- **Issues**: Create an issue on GitHub
- **Email**: support@agrobot.com
- **Documentation**: See README.md for detailed docs

---

**Happy Farming! 🌾**
