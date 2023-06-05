import { Controller, Get, Post, Patch, Delete, HttpCode, Body } from '@nestjs/common';
import { GraphsService } from './graphs.service';
import { CreateGraphDto, UpdateGraphDto } from './graphs.dto';
import { ValidationPipe } from './graphs.pipe';


@Controller('graphs')
export class GraphsController {

    constructor(private readonly graphService: GraphsService) {}

    @Get()
    @HttpCode(200) 
    async findAll() {
        return this.graphService.findAll();
    }

    @Get(':id')
    @HttpCode(200)
    async findOneById(id: string) {
        return this.graphService.findOneById(id);
    }

    @Post()
    @HttpCode(201)
    async createGraph(@Body(new ValidationPipe())createGraphDto: CreateGraphDto) {
        return this.graphService.createGraph(createGraphDto);
    }

    @Patch(':id')
    @HttpCode(200)
    async updateOneById(@Body(new ValidationPipe())updateGraphDto: UpdateGraphDto, id: string) {
        return this.graphService.updateOneById(id, updateGraphDto);
    }

    @Delete(':id')
    @HttpCode(200)
    async deleteOneById(id: string) {
        return this.graphService.deleteOneById(id);
    }

}
