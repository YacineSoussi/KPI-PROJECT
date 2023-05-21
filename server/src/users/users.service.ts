import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {

    public constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    public async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async findOneById(id: string): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    public async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email });
    }

    public async findOneByApiKey(apiKey: string): Promise<User> {
        return await this.userRepository.findOneBy({ apiKey });
    }

    public async create(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async register(user: CreateUserDto): Promise<User> {

        const newUser = {
            ...user,
            apiKey: this.generateKey(),
            secretKey: this.generateKey(),
        };
        
        return await this.userRepository.save(newUser);
    }

    public async getUserURLsFromDatabase(): Promise<string[]> {
        const users = await this.userRepository.find();
        const urls = users.map((user) => user.url);
        return urls;
    }   

    public generateKey(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
      
}
