import { Controller, Get, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/visitor.dto';
import { Visitor } from './schema/visitor.model';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @HttpCode(200)
  @Get()
  async findAll(): Promise<Visitor[]> {
    return this.visitorService.findAllVisitors();
  }

  @HttpCode(200)
  @Get('/month')
  async findVisitorsPerMonth(): Promise<Visitor[]> {
    return this.visitorService.findVisitorPerMonth();
  }

  @HttpCode(201)
  @Post()
  async create(@Body(new ValidationPipe({transform: true})) createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    return this.visitorService.createVisitor(createVisitorDto);
  }

  // async update(@Body() updateVisitorDto: CreateVisitorDto): Promise<Visitor> {
  //   return this.visitorService.updateVisitor(updateVisitorDto.id, updateVisitorDto);
  // }
  
}
