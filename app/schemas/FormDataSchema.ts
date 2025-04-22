import { z } from "zod";

export const FormDataSchema = z.object({
    contactInfo: z.object({
        fullName: z.string().optional(),
        title: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        phoneIsWhatsapp: z.boolean().optional(),
        linkedinUsername: z.string().optional(),
        githubUsername: z.string().optional(),
        hasLinkedin: z.boolean().optional(),
        hasGithub: z.boolean().optional(),
    }),
    content: z.object({
        sections: z.object({
            'Sobre mim': z.string().optional(),
            'Soft Skills': z.string().optional(),
            'Diferenciais': z.string().optional(),
        }),
        experience: z.array(z.object({
            company: z.string().optional(),
            title: z.string().optional(),
            startDate: z.object({
                month: z.string().optional(),
                year: z.string().optional(),
            }),
            endDate: z.union([z.object({
                month: z.string().optional(),
                year: z.string().optional(),
            }), z.literal('Atual')]).optional(),
            description: z.string().optional(),
            isCurrent: z.boolean().optional(),
        })),
        education: z.array(z.object({
            institution: z.string().optional(),
            degree: z.string().optional(),
            startDate: z.object({
                month: z.string().optional(),
                year: z.string().optional(),
            }),
            endDate: z.union([z.object({
                month: z.string().optional(),
                year: z.string().optional(),
            }), z.literal('Atual')]).optional(),
            description: z.string().optional(),
        })),
        skills: z.record(z.record(z.array(z.string()))),
    }),
    jobDetails: z.string().optional(),
    apiKey: z.string().optional(),
});