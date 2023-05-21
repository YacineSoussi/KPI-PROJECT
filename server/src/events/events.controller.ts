import { Controller, Get, Post, Body, Param, HttpCode, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { EventsService } from './events.service';
import { HeadersInterceptor } from 'src/user-agent/user-agent.interceptor';

@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) {}

    @Get()
    @HttpCode(200)
    async findAll(): Promise<any[]> {
        return this.eventsService.findAll();
    }

    @Get(':tag')
    @HttpCode(200)
    async findEventsByTag(@Param('tag') tag: string): Promise<any[]> {
        return this.eventsService.findEventsByTag(tag);
    }

    @Get(':apiKey')
    @HttpCode(200)
    async findEventsByApiKey(@Param('apiKey') apiKey: string): Promise<any[]> {
        return this.eventsService.findEventsByApiKey(apiKey);
    }

    @Post()
    @HttpCode(201)
    @UseInterceptors(HeadersInterceptor)
    async create(@Body(new ValidationPipe({transform: true})) createEventDto: CreateEventDto): Promise<any> {
        return this.eventsService.createEvent(createEventDto);
    }


}
