import { Controller, Post, Body, Param, Get, Patch, Delete, HttpCode } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './tags.dto';
import { Tag } from 'src/aggregate/schema/tag.model';
import { ValidationPipe } from './tags.pipe';


@Controller('tags')
export class TagsController {

    constructor(private readonly tagsService: TagsService) {}

    @Get()
    @HttpCode(200)
    async findAll(): Promise<Tag[]> 
    {
        return this.tagsService.findAll();
    }

    @Post()
    @HttpCode(201)
    async create(@Body(new ValidationPipe()) createTagDto: CreateTagDto): Promise<Tag> 
    {
        return this.tagsService.createTag(createTagDto);
    }

    @Patch(':id')
    @HttpCode(200)
    async update(
    @Body(new ValidationPipe()) updateTagDto: UpdateTagDto, 
    @Param('id') id: string
    ): Promise<Tag> 
    {
        return this.tagsService.updateTag(id, updateTagDto);
    }

    @Get(':id')
    @HttpCode(200)
    async findTagById(@Param('id') id: string): Promise<Tag>
    {
        return this.tagsService.findTagById(id);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void>
    {
        return this.tagsService.deleteTag(id);
    }

}
