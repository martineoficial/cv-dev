import { z } from "zod";

export const FormDataSchema = z.object({
    contactInfo: z.object({
        fullName: z.string(),
        title: z.string(),
        email: z.string(),
        phone: z.string(),
        phoneIsWhatsapp: z.boolean().optional(),
        linkedinUsername: z.string().optional(),
        githubUsername: z.string().optional(),
        hasLinkedin: z.boolean().optional(),
        hasGithub: z.boolean().optional(),
    }),
    content: z.object({
        sections: z.object({
            'Sobre mim': z.string(),
            'Soft Skills': z.string(),
            'Diferenciais': z.string(),
        }),
        experience: z.array(z.object({
            company: z.string(),
            title: z.string(),
            startDate: z.object({
                month: z.string(),
                year: z.string(),
            }),
            endDate: z.union([z.object({
                month: z.string(),
                year: z.string(),
            }), z.literal('Atual')]).optional(),
            description: z.string().optional(),
            isCurrent: z.boolean().optional(),
        })),
        education: z.array(z.object({
            institution: z.string(),
            degree: z.string(),
            startDate: z.object({
                month: z.string(),
                year: z.string(),
            }),
            endDate: z.union([z.object({
                month: z.string(),
                year: z.string(),
            }), z.literal('Atual')]).optional(),
            description: z.string().optional(),
        })),
        skills: z.record(z.record(z.array(z.string()))),
    }),
    jobDetails: z.string().optional(),
    apiKey: z.string().optional(),
});