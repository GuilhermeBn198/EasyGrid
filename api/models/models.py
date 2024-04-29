from database.database import db

class Usuario(db.Model):
    email = db.Column(db.String(120), primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    tipo = db.Column(db.Integer, nullable=False)
    senha = db.Column(db.String(60), nullable=False)

class Materia(db.Model):
    nome = db.Column(db.String(120), primary_key=True)
    semestre_id = db.Column(db.Integer, db.ForeignKey('semestre.id'), nullable=False)
    horario_id = db.Column(db.Integer, db.ForeignKey('horario.horario'), nullable=True)

class Horario(db.Model):
    horario = db.Column(db.Integer, primary_key=True)
    ocupado = db.Column(db.String(120), nullable=True)
    materia_id = db.Column(db.String(120), db.ForeignKey('materia.nome'), nullable=True)

class Semestre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
