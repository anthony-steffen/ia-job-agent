import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Interface para garantir a estrutura do retorno
export interface CreateApplicationResponse {
  message: string;
  applicationId: string;
  fileName: string;
  status: string;
}

@Injectable()
export class JobsService {
  private prisma = new PrismaClient();

  async createApplication(
    userId: string,
    jobDescription: string,
    file: Express.Multer.File,
  ): Promise<CreateApplicationResponse> {
    // Tipagem do retorno
    if (!file) {
      throw new BadRequestException('O arquivo de currículo é obrigatório.');
    }

    const application = await this.prisma.application.create({
      data: {
        userId,
        jobDescription,
        status: 'PENDING',
      },
    });

    return {
      message: 'Candidatura registrada. Aguardando processamento da IA...',
      applicationId: application.id,
      fileName: file.originalname,
      status: application.status,
    };
  }
}
