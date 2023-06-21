import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../aggregate/schema/event.model';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject('EVENT_MODEL') private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    
    return createdEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findEventsByTag(tag: string): Promise<Event[]> {
    return this.eventModel.find({ tag }).exec();
  }

  async findEventsByApiKey(apiKey: string): Promise<Event[]> {
    return this.eventModel.find({ apiKey }).exec();
  }

  async findEventsByEvent(event: string): Promise<Event[]> {
    return this.eventModel.find({ event }).exec();
    }

  async updateEvent(id: string, event: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.eventModel.findByIdAndUpdate(id, event, {
      new: true,
    });
    return existingEvent.save();
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.eventModel.findByIdAndDelete(id);
    event.remove();
  }
}
