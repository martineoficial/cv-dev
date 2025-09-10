import { z } from "zod";
import { FormDataSchema } from "../schemas/FormDataSchema";

export type Context = {
    context: 'Dev' | 'Marketing'
}

export type Experience = {
    company: string;
    title: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string } | 'Atual';
    description: string;
    isCurrent?: boolean;
}

export type Education = {
    institution: string;
    degree: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string } | 'Atual';
    description?: string;
}

export type FormData = z.infer<typeof FormDataSchema>;