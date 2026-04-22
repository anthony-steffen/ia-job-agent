/* eslint-disable @typescript-eslint/only-throw-error */
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface CreateApplicationResponse {
  message: string;
  applicationId: string;
  fileName: string;
  status: string;
}

@Injectable()
export class JobsService {
  private readonly prisma = new PrismaClient();
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly httpService: HttpService) {}

  async createApplication(
    userId: string,
    jobDescription: string,
    file: Express.Multer.File,
  ): Promise<CreateApplicationResponse> {
    if (!file) {
      throw new BadRequestException('O arquivo de currículo é obrigatório.');
    }

    // 1. Persistência no Banco
    const application = await this.prisma.application.create({
      data: {
        userId,
        jobDescription,
        status: 'PENDING',
      },
    });

    const uint8Array = new Uint8Array(file.buffer);

    const formData = new FormData();

    const fileBlob = new Blob([uint8Array], { type: file.mimetype });

    formData.append('applicationId', application.id);
    formData.append('jobDescription', jobDescription);
    formData.append('file', fileBlob, file.originalname);

    // 3. Chamada ao Microserviço Python (Porta 8000)
    // Usamos o padrão do NestJS para lidar com erros de Observables
    try {
      await firstValueFrom(
        this.httpService
          .post('http://localhost:8000/process-application', formData)
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                `Erro na resposta do Python: ${JSON.stringify(error.response?.data)}`,
              );
              throw 'Falha ao processar candidatura no serviço de IA.';
            }),
          ),
      );
      this.logger.log(
        `Candidatura ${application.id} enviada com sucesso ao Agente.`,
      );
    } catch (err) {
      this.logger.error(`Erro de conexão com o serviço de IA: ${err}`);
      // Não travamos o retorno para o usuário, pois o dado já está no banco
    }

    return {
      message: 'Candidatura registrada com sucesso.',
      applicationId: application.id,
      fileName: file.originalname,
      status: application.status,
    };
  }
}
