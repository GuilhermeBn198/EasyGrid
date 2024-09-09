# EasyGrid

Projeto JS/TS para sorting de horários de aulas em intervalos dinâmicos baseados em restrições mutuas.

## Tipos de usuários

- Professor: Privilégios de visualização do schedule e sugestões de horários disponíveis(WIP).
- Coordenador: Privilégios totais de administração da plataforma, criação de usuários, criação de semestres, disciplinas e horários.

## Features

- Registro de usuários terceiros por parte de usuários coordenadores.
- Registro de semestres.
- Registro de disciplinas atribuídas à semestres.
- Registro de horários semanais baseados nas restrições.(WIP)

## Restrição de criação de horários de disciplinas

- materias de mesmos semestres não podem chocar horário(WIP)
- materias de um mesmo professor não podem chocar horário(WIP)
- materias só podem ser atribuidas em horários até 16H(WIP)
- matérias só devem ser atribuídas no máximo até 06 horários diferentes(WIP)
- materias só podem ser atribuídas no mínino à 04 horários diferentes(WIP)
- materias devem ser atribuidas em 2 horários seguidos, ex: 24M12(WIP)

## Instalação e configuração

### for production

[WIP]

### for development

1. Download the latest main branch files of the project.
2. Instal nodeJS and Docker in your machine.
3. Copy the file .env.example and rename it to ```.env``` then change its code to attend your database instance.
4. run the command ```docker compose up```.
5. in other terminal window, run ```npm run dev```.
