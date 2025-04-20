export interface Experience {
    company: string;
    title: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string } | 'Atual';
    description: string;
    isCurrent?: boolean;
}

export interface Education {
    institution: string;
    degree: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string } | 'Atual';
    description?: string;
}

export interface FormData {
    name: string;
    title: string;
    email: string;
    phone: string;
    phoneIsWhatsapp: boolean;
    linkedinUsername: string;
    githubUsername?: string;
    hasLinkedin: boolean;
    hasGithub?: boolean;
    sections: {
        'Sobre mim': string;
        'Soft Skills': string;
        'Diferenciais': string;
    };
    experience: Experience[];
    education: Education[];
    skills: {
        [category: string]: {
            [subcategory: string]: string[];
        };
    };
}