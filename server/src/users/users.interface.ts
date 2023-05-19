import { Role } from '../authentication//authentication.enum';

export interface UserInterface {
    id: string;
    email: string;
    password: string;
    apiKey: string;
    secretKey: string;
    url: string;
    role: Role;
}