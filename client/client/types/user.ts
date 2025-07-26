export interface User {
    _id: string;
    name: string;
    email: string;
    techStack?: string[];
    goal?: string;
    level?: string;
    availability?: string;
}
