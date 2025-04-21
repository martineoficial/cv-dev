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

            // TODO: Adicione aqui a lógica para incluir outros campos no pdfContent,
            // como título, email, seções de conteúdo ('Sobre mim', etc.), experiências, educação, skills.
            // Exemplo (apenas para ilustrar onde adicionar):
            // if (formData.contactInfo.title) {
            //     pdfContent.push({ text: formData.contactInfo.title, style: 'titleStyle' }); // Crie 'titleStyle' nos styles
            // }
            // if (formData.content.sections['Sobre mim']) {
            //      pdfContent.push({ text: 'Sobre mim', style: 'sectionTitle' }); // Crie 'sectionTitle' nos styles
            //      pdfContent.push({ text: formData.content.sections['Sobre mim'], style: 'sectionContent' }); // Crie 'sectionContent' nos styles
            // }
            // ... e assim por diante para as experiências, educação, skills, etc.


            const pdfDoc = PDFDocument.createPdf({
                content: pdfContent,
                styles: {
                    fullName: {
                        fontSize: 24,
                        bold: true,
                        margin: [0, 0, 0, 8],
                    },
                    title: {
                        fontSize: 18,
                        italics: true,
                        margin: [0, 0, 0, 8],
                    },
                    contacts: {
                        fontSize: 12,
                        margin: [0, 0, 0, 8],
                    },
                    sectionTitle: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    sectionContent: {
                        fontSize: 12,
                        margin: [0, 0, 0, 10],
                    },
                    // TODO: Adicione aqui outros estilos que você precisar (sectionTitle, sectionContent, etc.)
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