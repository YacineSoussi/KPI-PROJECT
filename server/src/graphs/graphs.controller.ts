import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode,
  Body,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { CreateGraphDto, UpdateGraphDto } from './graphs.dto';
import { ValidationPipe } from './graphs.pipe';
import { AuthenticationRequired } from 'src/authentication/authentication.decorator';
import { ApiKeyInterceptor } from 'src/users/users.interceptor';

@Controller('graphs')
export class GraphsController {
  constructor(private readonly graphService: GraphsService) {}

  @AuthenticationRequired()
  @UseInterceptors(ApiKeyInterceptor)
  @Get()
  @HttpCode(200)
  async findAll(@Req() req: any) {
    return this.graphService.findAll(req.apiKey);
  }

  @AuthenticationRequired()
  @Get('data')
  @HttpCode(200)
  async getDataGraphs() {
    return this.graphService.getDataGraphs();
  }

  @AuthenticationRequired()
  @Post('aggregate')
  @HttpCode(200)
  @UseInterceptors(ApiKeyInterceptor)
  async generateGraphsAggregate(
    @Body(new ValidationPipe()) createGraphDto: CreateGraphDto,
    @Req() req: any,
  ) {
    return this.graphService.generateGraphsAggregate(
      createGraphDto,
      req.apiKey,
    );
  }

  @Get(':id')
  @HttpCode(200)
  async findOneById(id: string) {
    return this.graphService.findOneById(id);
  }

  @AuthenticationRequired()
  @UseInterceptors(ApiKeyInterceptor)
  @Post()
  @HttpCode(201)
  async createGraph(
    @Body(new ValidationPipe()) createGraphDto: CreateGraphDto,
    @Req() req: any,
  ) {
    return this.graphService.createGraph({
      ...createGraphDto,
      apiKey: req.apiKey,
    });
  }

  @AuthenticationRequired()
  @Patch(':id')
  @HttpCode(200)
  async updateOneById(
    @Body(new ValidationPipe()) updateGraphDto: UpdateGraphDto,
    id: string,
  ) {
    return this.graphService.updateOneById(id, updateGraphDto);
  }

  @AuthenticationRequired()
  @Delete(':id')
  @HttpCode(200)
  async deleteOneById(id: string) {
    return this.graphService.deleteOneById(id);
  }
}
