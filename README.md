## 🤖 Agente de Candidatura Automática - Backend

Este é o núcleo de inteligência e automação do projeto. O backend é responsável por capturar vagas, processar currículos através de IA e gerenciar o fluxo de candidaturas de forma eficiente.

## 🏗️ Arquitetura do Sistema

O projeto utiliza uma arquitetura baseada em Camadas (Layered Architecture) e segue os princípios do SOLID para garantir que o sistema seja testável e fácil de expandir.

## Componentes Principais

API Layer (Controllers): Responsável por receber as requisições do frontend e validar os dados de entrada

Service Layer (Business Logic): Onde reside a lógica de negócio, como as regras de matching entre vaga e currículo.

AI Integration (Agno/OpenAI): Camada especializada na comunicação com modelos de linguagem para geração de conteúdo personalizado.

Worker Layer (Task Queue): Sistema de filas para processar o scraping de vagas e chamadas de IA sem travar a execução da API principal.

Data Layer (Prisma ORM): Interface de comunicação com o banco de dados.

## 🛠️ Stack Tecnológica

Runtime: Node.js (v18+)

Framework: NestJS (TypeScript)

Banco de Dados: PostgreSQL

ORM: Prisma

Processamento de IA: Agno Framework (ou integração direta com OpenAI/Anthropic)

Automação/Scraping: Playwright

Filas e Mensageria: BullMQ + Redis

## 🚀 Como Iniciar

Pré-requisitos
Node.js instalado (LTS recomendado).

Docker (opcional, mas recomendado para rodar PostgreSQL e Redis rapidamente).

Uma chave de API da OpenAI (ou provedor de IA de sua escolha).

1. Clonar e Instalar
Bash
git clone <https://github.com/seu-usuario/nome-do-repositorio.git>
cd nome-do-repositorio
npm install
2. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:

Snippet de código

# Banco de Dados

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

# Redis (para as filas)

REDIS_HOST="localhost"
REDIS_PORT=6379

# IA

OPENAI_API_KEY="sua_chave_aqui"
3. Configurar o Banco de Dados
Bash
npx prisma migrate dev --name init
4. Rodar o Projeto
Bash

# Modo de desenvolvimento

npm run start:dev

# Modo de produção

npm run build
npm run start:prod
