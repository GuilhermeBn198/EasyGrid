#!/bin/sh
set -e

# Aguardando o banco de dados estar pronto
echo "Aguardando o PostgreSQL iniciar..."
until pg_isready -h database -p 5432 -U postgres; do
  sleep 1
done

echo "Populando o banco de dados..."
# Definir a senha e rodar o dump
PGPASSWORD=postgres psql -h database -U postgres -d postgres -a -f /app/datadump.sql
