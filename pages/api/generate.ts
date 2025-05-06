import { FormDataSchema } from '@/app/schemas/FormDataSchema';
import type { FormData } from '@/app/types/types';
import { capitalizeAllWords } from '@/app/utils/capitalize';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import PDFDocument from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';

PDFDocument.vfs = pdfFonts.vfs;

const fontsDir = path.join(process.cwd(), 'public/fonts');
if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
    console.error("A pasta 'public/fonts' não foi encontrada. Por favor, crie uma pasta 'fonts' dentro da pasta 'public' e adicione os arquivos de fonte Roboto.");
    console.error("Você pode baixar as fontes em: https://fonts.google.com/specimen/Roboto");
} else {
    const fontFiles = ['Roboto-Regular.ttf', 'Roboto-Medium.ttf', 'Roboto-Italic.ttf', 'Roboto-MediumItalic.ttf'];
    fontFiles.forEach(file => {
        if (!fs.existsSync(path.join(fontsDir, file))) {
            console.error(`O arquivo de fonte '${file}' não foi encontrado na pasta 'public/fonts'.`);
            console.error("Por favor, adicione os arquivos de fonte Roboto na pasta 'public/fonts'.");
            console.error("Você pode baixar as fontes em: https://fonts.google.com/specimen/Roboto");
        }
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const validationResult = FormDataSchema.safeParse(req.body);

            if (!validationResult.success) {
                console.error('Erro de validação:', validationResult.error);
                return res.status(400).json({ error: 'Dados inválidos' });
            }

            const formData: FormData = validationResult.data;

            const pdfContent: Content[] = [];

            if (formData.contactInfo.fullName) {
                pdfContent.push({
                    text: capitalizeAllWords(formData.contactInfo.fullName),
                    style: 'fullName',
                });
            }

            if (formData.contactInfo.title) {
                pdfContent.push({
                    text: capitalizeAllWords(formData.contactInfo.title),
                    style: 'title',
                });
            }

            if (formData.contactInfo.email) {
                pdfContent.push({
                    text: formData.contactInfo.email,
                    style: 'contacts',
                    link: `mailto:${formData.contactInfo.email}`,
                });
            }

            if (formData.contactInfo.phone) {
                pdfContent.push({
                    text: formData.contactInfo.phone,
                    style: 'contacts',
                    link: formData.contactInfo.phoneIsWhatsapp
                        ? `https://wa.me/${formData.contactInfo.phone}`
                        : `tel:${formData.contactInfo.phone}`,
                });
            }

            if (formData.contactInfo.linkedinUsername) {
                pdfContent.push({
                    text: `LinkedIn: ${formData.contactInfo.linkedinUsername}`,
                    style: 'contacts',
                    link: `https://www.linkedin.com/in/${formData.contactInfo.linkedinUsername}`,
                });
            }

            if (formData.contactInfo.githubUsername) {
                pdfContent.push({
                    text: `GitHub: ${formData.contactInfo.githubUsername}`,
                    style: 'contacts',
                    link: `https://github.com/${formData.contactInfo.githubUsername}`,
                });
            }

            if (formData.content.sections['Sobre mim']) {
                pdfContent.push({
                    text: 'Sobre mim',
                    style: 'sectionTitle',
                });
                pdfContent.push({
                    text: formData.content.sections['Sobre mim'],
                    style: 'sectionContent',
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const skillsContent = [] as any;
            if (formData.content.skills) {
                Object.entries(formData.content.skills).forEach(([category, subcategories]) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const categorySkills = [] as any;
                    Object.entries(subcategories || {}).forEach(([subcategory, skills]) => {
                        if (skills && skills.length > 0) {
                            categorySkills.push({ text: `${subcategory}: ${skills.join(', ')}`, style: 'skillSubcategoryText' });
                        }
                    });
                    if (categorySkills.length > 0) {
                        skillsContent.push({ text: category, style: 'skillCategory' });
                        skillsContent.push({ stack: categorySkills, margin: [10, 0, 0, 5] });
                    }
                });
            }
            if (skillsContent.length > 0) {
                pdfContent.push({ text: 'Habilidades Técnicas', style: 'sectionHeader' });
                pdfContent.push(...skillsContent);
            }

            if (formData.content.experience && formData.content.experience.length > 0) {
                pdfContent.push({ text: 'Experiência', style: 'sectionTitle' });
                formData.content.experience.forEach((exp) => {
                    const expContent = [];
                    if (exp.company) {
                        expContent.push({ text: exp.company, style: 'expCompany' });
                    }
                    if (exp.title) {
                        expContent.push({ text: exp.title, style: 'expTitle' });
                    }

                    if (exp.startDate && exp.isCurrent) {
                        expContent.push({ 
                            text: `${typeof exp.startDate === 'object' ? `${exp.startDate.month}/${exp.startDate.year}` : exp.startDate} - Atual`, 
                            style: 'dateRange'
                        });
                    } else if (exp.startDate && exp.endDate) {
                        expContent.push({ 
                            text: `${typeof exp.startDate === 'object' ? `${exp.startDate.month}/${exp.startDate.year}` : exp.startDate} - ${typeof exp.endDate === 'object' ? `${exp.endDate.month}/${exp.endDate.year}` : exp.endDate}`, 
                            style: 'dateRange'
                        });
                    } else if (exp.startDate) {
                        expContent.push({ text: `${exp.startDate.month} ${exp.startDate.year}`, style: 'dateRange' });
                    }
                    
                    if (exp.description) {
                        expContent.push({ text: exp.description, style: 'sectionContent' });
                    }
                    pdfContent.push({ stack: expContent, margin: [0, 0, 0, 10] });
                });
            }

            if (formData.content.education && formData.content.education.length > 0) {
                pdfContent.push({ text: 'Educação', style: 'sectionTitle' });
                formData.content.education.forEach((edu) => {
                    const eduContent = [];
                    if (edu.institution) {
                        eduContent.push({ text: edu.institution, style: 'expCompany' });
                    }
                    if (edu.degree) {
                        eduContent.push({ text: edu.degree, style: 'expTitle' });
                    }
                    if (edu.startDate && edu.endDate) {
                        eduContent.push({ 
                            text: `${typeof edu.startDate === 'object' ? `${edu.startDate.month}/${edu.startDate.year}` : edu.startDate} - ${typeof edu.endDate === 'object' ? `${edu.endDate.month}/${edu.endDate.year}` : edu.endDate}`, 
                            style: 'dateRange'
                        });
                    } else if (edu.startDate) {
                        eduContent.push({ text: `${edu.startDate.month} ${edu.startDate.year}`, style: 'dateRange' });
                    }
                    pdfContent.push({ stack: eduContent, margin: [0, 0, 0, 10] });
                });
            }

            if (formData.content.sections['Soft Skills']) {
                pdfContent.push({ text: 'Soft Skills', style: 'sectionTitle' });
                pdfContent.push({ text: formData.content.sections['Soft Skills'], style: 'sectionContent' });
            }
            if (formData.content.sections['Diferenciais']) {
                pdfContent.push({ text: 'Diferenciais', style: 'sectionTitle' });
                pdfContent.push({ text: formData.content.sections['Diferenciais'], style: 'sectionContent' });
            }

            const pdfDoc = PDFDocument.createPdf({
                content: pdfContent,
                styles: {
                    fullName: {
                        fontSize: 20,
                        bold: true,
                        margin: [0, 0, 0, 5],
                    },
                    title: {
                        fontSize: 16,
                        italics: true,
                        margin: [0, 0, 0, 10],
                    },
                    contacts: {
                        fontSize: 12,
                        margin: [0, 0, 0, 5],
                        color: '#555',
                    },
                    sectionTitle: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    sectionContent: {
                        fontSize: 12,
                        margin: [0, 0, 0, 10],
                    },
                    sectionHeader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    skillCategory: {
                        fontSize: 12,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    skillSubcategoryText: {
                        fontSize: 12,
                        margin: [0, 0, 0, 5],
                    },
                    expCompany: {
                        fontSize: 12,
                        bold: true,
                        margin: [0, 0, 0, 5],
                    },
                    expTitle: {
                        fontSize: 12,
                        italics: true,
                        margin: [0, 0, 0, 5],
                    },
                    dateRange: {
                        fontSize: 12,
                        margin: [0, 0, 0, 5],
                        color: '#777',
                    },
                },
                defaultStyle: {
                    fontSize: 11,
                    color: '#333',
                },
            });

            pdfDoc.getBase64((data: string) => {
                const buffer = Buffer.from(data, 'base64');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=curriculo.pdf');
                res.send(buffer);
            });

        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            res.status(500).json({ error: 'Erro ao gerar o PDF', details: errorMessage });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}