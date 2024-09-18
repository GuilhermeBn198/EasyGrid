FROM node:alpine3.20

# Instalação do PostgreSQL client para realizar o dump
RUN apk update && apk upgrade && apk add --no-cache postgresql-client

WORKDIR /app

# Copiar todos os arquivos, incluindo o script e o dump SQL
COPY . /app

RUN npm i

# Tornar o script de dump executável
RUN chmod +x /app/datadump.sh

# Comando para rodar o script de dump no banco de dados e iniciar a aplicação
CMD ["sh", "-c", "sh /app/datadump.sh && npm run dev"]
