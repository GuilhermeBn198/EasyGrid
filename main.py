import os
from dotenv import load_dotenv
from flask import Flask
from database.database import db
from api.models.models import Usuario, Materia, Horario, Semestre 

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Acessa as variáveis de ambiente
postgres_user = os.environ.get("POSTGRES_USER")
postgres_password = os.environ.get("POSTGRES_PASSWORD")
postgres_db = os.environ.get("POSTGRES_DB")

# Configura a URI do banco de dados
database_uri = f'postgresql://{postgres_user}:{postgres_password}@localhost/{postgres_db}'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
db.init_app(app)
print("Database loaded")

with app.app_context():
    db.create_all()