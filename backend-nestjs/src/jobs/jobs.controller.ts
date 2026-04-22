import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobsService, CreateApplicationResponse } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('apply')
  @UseInterceptors(FileInterceptor('resume'))
  async applyForJob(
    @Body('userId') userId: string,
    @Body('jobDescription') jobDescription: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateApplicationResponse> {
    return this.jobsService.createApplication(userId, jobDescription, file);
  }
}
