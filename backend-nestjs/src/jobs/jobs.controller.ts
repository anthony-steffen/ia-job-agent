import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobsService, CreateApplicationResponse } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('resume'))
  async applyForJob(
    @Body('userId', new ParseUUIDPipe()) userId: string,
    @Body('jobDescription') jobDescription: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateApplicationResponse> {
    if (!file) {
      throw new BadRequestException(
        'O arquivo de currículo (PDF) não foi enviado.',
      );
    }

    if (!jobDescription || jobDescription.trim().length < 10) {
      throw new BadRequestException(
        'A descrição da vaga é obrigatória e deve ser detalhada.',
      );
    }

    return await this.jobsService.createApplication(
      userId,
      jobDescription,
      file,
    );
  }
}
