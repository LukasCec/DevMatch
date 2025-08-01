export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    techStack?: string[];
    goal?: string;
    level?: string;
    availability?: string;
}
