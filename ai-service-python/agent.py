from agno.agent import Agent
from agno.models.openai import OpenAIChat
from dotenv import load_dotenv

load_dotenv()

# Este agente será responsável por analisar a compatibilidade
job_agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini"),
    description="Você é um recrutador técnico sênior. Sua função é analisar currículos e adaptá-los para vagas específicas.",
    instructions=[
        "Analise o currículo fornecido em relação à descrição da vaga.",
        "Extraia o nome da empresa da descrição da vaga.",
        "Gere um novo currículo otimizado destacando as experiências mais relevantes para esta vaga.",
        "Escreva um e-mail de apresentação persuasivo e profissional.",
    ],
    markdown=True,
)
