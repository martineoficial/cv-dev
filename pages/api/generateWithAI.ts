import { FormDataSchema } from '@/app/schemas/FormDataSchema';
import { capitalizeAllWords } from '@/app/utils/capitalize';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions, TFontDictionary, Content, Column } from 'pdfmake/interfaces';
import { run } from './googleGenerativeAI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const validationResult = FormDataSchema.safeParse(req.body);
        if (!validationResult.success) return res.status(400).json({ error: 'Dados inválidos' });

        const formData = validationResult.data;
        const pdfContent: Content[] = [];

        const fonts: TFontDictionary = {
            Roboto: {
                normal: path.join(process.cwd(), 'public/fonts/Roboto-Regular.ttf'),
                bold: path.join(process.cwd(), 'public/fonts/Roboto-Medium.ttf'),
                italics: path.join(process.cwd(), 'public/fonts/Roboto-Italic.ttf'),
                bolditalics: path.join(process.cwd(), 'public/fonts/Roboto-MediumItalic.ttf')
            }
        };

        if (formData.apiKey && formData.jobDetails) {

            if (formData.contactInfo.fullName) {
                pdfContent.push({ text: capitalizeAllWords(formData.contactInfo.fullName), style: 'fullName' });
            }

            if (formData.contactInfo.title) {
                pdfContent.push({ text: formData.contactInfo.title.toUpperCase(), style: 'jobTitleHeader' });
            }

            const contactLinks: Content[] = [];

            if (formData.contactInfo.email) {
                contactLinks.push({ text: formData.contactInfo.email, link: `mailto:${formData.contactInfo.email}` });
            }

            if (formData.contactInfo.phone) {
                const cleanPhone = formData.contactInfo.phone.replace(/\D/g, '');
                contactLinks.push({ text: formData.contactInfo.phone, link: `https://wa.me/${cleanPhone}` });
            }

            if (formData.contactInfo.linkedinUsername) {
                contactLinks.push({
                    text: 'LinkedIn',
                    link: `https://linkedin.com/in/${formData.contactInfo.linkedinUsername}`
                });
            }

            if (formData.contactInfo.githubUsername) {
                contactLinks.push({
                    text: 'GitHub',
                    link: `https://github.com/${formData.contactInfo.githubUsername}`
                });
            }

            const contactRow: Content = {
                text: contactLinks.reduce((acc: Content[], curr, idx) => {
                    acc.push(curr);
                    if (idx < contactLinks.length - 1) acc.push('  •  ');
                    return acc;
                }, []),
                style: 'contacts',
                margin: [0, 5, 0, 15]
            };
            pdfContent.push(contactRow);

            const addSection = (title: string) => {
                pdfContent.push({ text: title, style: 'sectionTitle' });
                pdfContent.push({
                    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#bdc3c7' }],
                    margin: [0, 0, 0, 8]
                });
            };

            const sobreMim = formData.content.sections['Sobre mim'];
            if (sobreMim) {
                addSection('RESUMO PROFISSIONAL');
                const opt = await run(formData.jobDetails, sobreMim, formData.apiKey);
                pdfContent.push({ text: opt, style: 'sectionContent' });
            }

            if (formData.content.skills) {
                const skillsEntries = Object.entries(formData.content.skills).map(([category, sub]) => {
                    const subs = Object.entries(sub || {}).map(([name, list]) => `${name}: ${list?.join(', ')}`);
                    return `${category}: ${subs.join('; ')}`;
                }).join(' | ');

                addSection('HABILIDADES TÉCNICAS');
                const optSkills = await run(formData.jobDetails, skillsEntries, formData.apiKey);
                pdfContent.push({ text: optSkills, style: 'sectionContent' });
            }

            if (formData.content.experience && formData.content.experience.length > 0) {
                addSection('EXPERIÊNCIA PROFISSIONAL');
                for (const exp of formData.content.experience) {
                    const start = typeof exp.startDate === 'object' ? `${exp.startDate.month}/${exp.startDate.year}` : exp.startDate;
                    const end = exp.isCurrent ? 'Atual' : (typeof exp.endDate === 'object' && exp.endDate ? `${exp.endDate.month}/${exp.endDate.year}` : exp.endDate);

                    pdfContent.push({
                        columns: [
                            { text: exp.company || '', style: 'expCompany', width: '*' } as Column,
                            { text: `${start} - ${end}`, style: 'dateRange', width: 'auto' } as Column
                        ]
                    });

                    pdfContent.push({ text: exp.title || '', style: 'expTitle', margin: [0, 2, 0, 5] });

                    if (exp.description) {
                        const optExp = await run(formData.jobDetails, exp.description, formData.apiKey);
                        pdfContent.push({ text: optExp, style: 'sectionContent' });
                    }
                }
            }

            const docDefinition: TDocumentDefinitions = {
                content: pdfContent,
                styles: {
                    fullName: { fontSize: 22, bold: true, color: '#1a2a3a' },
                    jobTitleHeader: { fontSize: 12, bold: true, color: '#34495e', margin: [0, 2, 0, 0] },
                    contacts: { fontSize: 10, color: '#1a2a3a', decoration: 'underline' },
                    sectionTitle: { fontSize: 11, bold: true, color: '#1a2a3a', margin: [0, 10, 0, 2] },
                    sectionContent: { fontSize: 10, margin: [0, 0, 0, 10], lineHeight: 1.3, alignment: 'justify' },
                    expCompany: { fontSize: 11, bold: true },
                    expTitle: { fontSize: 10, bold: true, italics: true, color: '#444' },
                    dateRange: { fontSize: 9, color: '#666' }
                },
                defaultStyle: { font: 'Roboto' },
                pageMargins: [40, 40, 40, 40]
            };

            const printer = new PdfPrinter(fonts);
            const pdfDoc = printer.createPdfKitDocument(docDefinition);

            const chunks: Uint8Array[] = [];
            pdfDoc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                res.send(result);
            });
            pdfDoc.end();
        }
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}