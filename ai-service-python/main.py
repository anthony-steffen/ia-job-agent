import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pypdf import PdfReader
from agent import job_agent
import uvicorn

app = FastAPI(title="AI Job Agent Service")


@app.post("/process-application")
async def process_application(
    applicationId: str = Form(...),
    jobDescription: str = Form(...),
    file: UploadFile = File(...),
):
    try:
        # 1. Ler o conteúdo binário
        content = await file.read()

        # 2. USANDO O 'io' e o 'content': transformar bytes em texto legível
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        resume_text = ""
        for page in reader.pages:
            resume_text += page.extract_text()

        # 3. Montar o prompt com o texto extraído
        prompt = (
            f"ID da Candidatura: {applicationId}\n"
            f"Descrição da Vaga: {jobDescription}\n"
            f"Conteúdo do Currículo: {resume_text}"
        )

        # 4. Chamar o agente
        response = job_agent.run(prompt)

        return {
            "applicationId": applicationId,
            "status": "PROCESSED",
            "analysis": response.content,
        }

    except Exception as e:
        print(f"Erro no processamento: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
