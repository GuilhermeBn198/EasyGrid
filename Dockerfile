FROM node:alpine3.20

# Instalação do PostgreSQL client para realizar o dump
RUN apk update && apk upgrade && apk add --no-cache postgresql-client

WORKDIR /app

# Copiar todos os arquivos, incluindo o script e o dump SQL
COPY . .

RUN npm i

# Tornar o script de dump executável
RUN chmod +x /datadump.sh

# Comando para rodar o script de dump no banco de dados e iniciar a aplicação
CMD ["sh", "-c", "sh /datadump.sh && npm run dev"]