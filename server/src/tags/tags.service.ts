import { CreateTagDto, UpdateTagDto } from './tags.dto';
import { TagDocument, Tag } from '../aggregate/schema/tag.model';
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class TagsService {
  constructor(
    @Inject('TAG_MODEL') private readonly tagModel: Model<TagDocument>,
  ) {}

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = new this.tagModel(createTagDto);

    return await createdTag.save();
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagModel.find().exec();
  }

  async findTagById(id: string): Promise<Tag> {
    return await this.tagModel.findById(id).exec();
  }

  async findTagByName(name: string): Promise<Tag> {
    return await this.tagModel.findOne({ name }).exec();
  }

  async findTagByApiKey(apiKey: string): Promise<Tag[]> {
    return await this.tagModel.find({ apiKey }).exec();
  }

  async updateTag(id: string, tag: UpdateTagDto): Promise<Tag> {
    const existingTag = await this.tagModel.findByIdAndUpdate(id, tag, {
      new: true,
    });
    return existingTag.save();
  }

  async deleteTag(id: string): Promise<void> {
    const tag = await this.tagModel.findByIdAndDelete(id);
    tag.remove();
  }
}
