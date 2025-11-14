# Project Configuration Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Flask Configuration
FLASK_SECRET_KEY=your_super_secret_key_change_this_in_production
FLASK_ENV=development
FLASK_DEBUG=True

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Database Configuration (Optional - defaults to SQLite)
DATABASE_URL=sqlite:///instance/site.db

# Upload Configuration
MAX_UPLOAD_SIZE=16777216  # 16MB in bytes
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,csv

# Admin Configuration
DEFAULT_ADMIN_EMAIL=admin@agro.com
DEFAULT_ADMIN_PASSWORD=admin123
```

## Important Security Notes

⚠️ **Before deploying to production:**

1. **Change SECRET_KEY**: Generate a strong random key
   ```python
   import secrets
   print(secrets.token_hex(32))
   ```

2. **Change Admin Password**: Update default admin credentials

3. **Disable Debug Mode**: Set `FLASK_DEBUG=False`

4. **Use HTTPS**: Enable SSL/TLS for secure communication

5. **Secure OpenAI Key**: Never commit API keys to version control

## Database Setup

### SQLite (Default)
No additional setup required. Database file will be created at `instance/site.db`

### PostgreSQL (Production)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/agrobot_db
```

Update `database.py` to use PostgreSQL:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
```

### MySQL
```env
DATABASE_URL=mysql://username:password@localhost:3306/agrobot_db
```

## OpenAI API Setup

1. Sign up at https://platform.openai.com/
2. Create an API key
3. Add to `.env` file
4. Monitor usage at https://platform.openai.com/usage

### API Cost Estimation
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Average chat: ~200-500 tokens
- Estimated cost: $0.0004-0.001 per chat

## Knowledge Base Configuration

### CSV Format
Place agricultural knowledge CSV files in the root directory:
- `kb_agriculture_master.csv`
- `kb_full_professional.csv`
- `kb_fruits_veggies_extended.csv`

### Required Columns
```csv
category,question,answer,keywords,language
crops,What is the best time to plant rice?,Rice should be planted during monsoon season...,rice plant timing monsoon,en
```

## Deployment Options

### 1. Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
heroku config:set OPENAI_API_KEY=your_key
```

### 2. AWS EC2
```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Setup Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 3. Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## Monitoring & Logging

Add logging to `app.py`:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

## Backup Strategy

### Database Backup
```bash
# SQLite
cp instance/site.db backups/site_$(date +%Y%m%d).db

# PostgreSQL
pg_dump agrobot_db > backups/backup_$(date +%Y%m%d).sql
```

### Automated Backups
Add to crontab:
```bash
0 2 * * * /path/to/backup_script.sh
```
