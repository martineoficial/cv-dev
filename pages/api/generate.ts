import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import PDFDocument from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


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
            console.clear();
            console.log('Gerando PDF...');
            console.log('Dados recebidos:', req.body);
            const formData = req.body;
            
            const content = [];

            if (formData.name) {
                content.push({ text: formData.name, style: 'header' });
            }
            // if (formData.title) {
            //     content.push({ text: formData.title, style: 'subheader' });
            // }

            // const contactInfo = [];
            // if (formData.email) {
            //     contactInfo.push({
            //         text: formData.email,
            //         style: 'contactInfo',
            //         link: `mailto:${formData.email}`,
            //     });
            // }
            // if (formData.phone) {
            //     const phoneNumber = formData.phone.replace(/[\s-()]/g, '');
            //     if (formData.phoneIsWhatsapp) {
            //         contactInfo.push({
            //             text: formData.phone,
            //             style: 'contactInfo',
            //             link: `https://wa.me/${phoneNumber}`,
            //         });
            //     } else {
            //         contactInfo.push({
            //             text: formData.phone,
            //             style: 'contactInfo',
            //         });
            //     }
            // }
            // if (formData.hasLinkedin && formData.linkedinUsername) {
            //     const linkedinUrl = `https://linkedin.com/in/${formData.linkedinUsername}`;
            //     contactInfo.push({
            //         text: `linkedin.com/in/${formData.linkedinUsername}`,
            //         style: 'contactInfo',
            //         link: linkedinUrl,
            //     });
            // }
            // if (formData.hasGithub && formData.githubUsername) {
            //     const githubUrl = `https://github.com/${formData.githubUsername}`;
            //     contactInfo.push({
            //         text: `github.com/${formData.githubUsername}`,
            //         style: 'contactInfo',
            //         link: githubUrl,
            //     });
            // }
            // if (contactInfo.length > 0) {
            //     content.push({ stack: contactInfo, margin: [0, 0, 0, 0] });
            // }

            // if (formData.sections['Sobre mim']) {
            //     content.push({ text: 'Sobre mim', style: 'sectionHeader' });
            //     content.push({ text: formData.sections['Sobre mim'] });
            // }

            // // eslint-disable-next-line @typescript-eslint/no-explicit-any
            // const skillsContent = [] as any;
            // if (formData.skills) {
            //     Object.entries(formData.skills).forEach(([category, subcategories]) => {
            //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //         const categorySkills = [] as any;
            //         Object.entries(subcategories || {}).forEach(([subcategory, skills]) => {
            //             if (skills && skills.length > 0) {
            //                 categorySkills.push({ text: `${subcategory}: ${skills.join(', ')}`, style: 'skillSubcategoryText' });
            //             }
            //         });
            //         if (categorySkills.length > 0) {
            //             skillsContent.push({ text: category, style: 'skillCategory' });
            //             skillsContent.push({ stack: categorySkills, margin: [10, 0, 0, 5] });
            //         }
            //     });
            // }
            // if (skillsContent.length > 0) {
            //     content.push({ text: 'Habilidades Técnicas', style: 'sectionHeader' });
            //     content.push(...skillsContent);
            // }

            // if (formData.experience && formData.experience.length > 0) {
            //     const experienceContent = formData.experience
            //         .filter(
            //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //             (exp: any) =>
            //                 exp.company ||
            //                 exp.title ||
            //                 (exp.startDate && exp.startDate.month && exp.startDate.year) ||
            //                 (exp.endDate && (exp.endDate === 'Atual' || (exp.endDate.month && exp.endDate.year))) ||
            //                 exp.description
            //         )
            //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //         .map((exp: any) => {
            //             const parts = [];
            //             if (exp.company) parts.push({ text: exp.company, style: 'experienceCompany' });
            //             if (exp.title) parts.push({ text: exp.title, style: 'experienceTitle' });
            //             const startDateValid = exp.startDate && exp.startDate.month && exp.startDate.year;
            //             const endDateValid =
            //                 exp.endDate && (exp.endDate === 'Atual' || (exp.endDate.month && exp.endDate.year));
            //             if (startDateValid || endDateValid) {
            //                 const startDate = startDateValid ? `${exp.startDate.month}/${exp.startDate.year}` : '';
            //                 const endDate = endDateValid
            //                     ? exp.endDate === 'Atual'
            //                         ? 'Atual'
            //                         : `${exp.endDate.month}/${exp.endDate.year}`
            //                     : '';
            //                 const period = `${startDate}${startDateValid && endDateValid ? ' - ' : ''}${endDate}`;
            //                 if (period) parts.push({ text: period, style: 'experiencePeriod' });
            //             }
            //             if (exp.description)
            //                 parts.push({ text: exp.description, style: 'experienceDescription', margin: [0, 5, 0, 10] });
            //             return parts.length > 0 ? parts : null;
            //         })
            //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //         .filter((item: any) => item !== null)
            //         .flat();

            //     if (experienceContent.length > 0) {
            //         content.push({ text: 'Experiência Profissional', style: 'sectionHeader' });
            //         content.push(...experienceContent);
            //     }
            // }

            // if (formData.education && formData.education.length > 0) {
            //     const educationContent = formData.education
            //         .filter(
            //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //             (edu: any) =>
            //                 edu.institution ||
            //                 edu.degree ||
            //                 (edu.startDate && edu.startDate.month && edu.startDate.year) ||
            //                 (edu.endDate && (edu.endDate === 'Atual' || (edu.endDate.month && edu.endDate.year)))
            //         )
            //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //         .map((edu: any) => {
            //             const parts = [];
            //             if (edu.institution) parts.push({ text: edu.institution, style: 'educationInstitution' });
            //             if (edu.degree) parts.push({ text: edu.degree, style: 'educationDegree' });
            //             const startDateValid = edu.startDate && edu.startDate.month && edu.startDate.year;
            //             const endDateValid =
            //                 edu.endDate && (edu.endDate === 'Atual' || (edu.endDate.month && edu.endDate.year));
            //             if (startDateValid || endDateValid) {
            //                 const startDate = startDateValid ? `${edu.startDate.month}/${edu.startDate.year}` : '';
            //                 const endDate = endDateValid
            //                     ? edu.endDate === 'Atual'
            //                         ? 'Atual'
            //                         : `${edu.endDate.month}/${edu.endDate.year}`
            //                     : '';
            //                 const period = `${startDate}${startDateValid && endDateValid ? ' - ' : ''}${endDate}`;
            //                 if (period) parts.push({ text: period, style: 'educationPeriod' });
            //             }
            //             if (edu.description)
            //                 parts.push({ text: edu.description, style: 'educationDescription', margin: [0, 5, 0, 10] });
            //             return parts.length > 0 ? parts : null;
            //         })
            //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //         .filter((item: any) => item !== null)
            //         .flat();

            //     if (educationContent.length > 0) {
            //         content.push({ text: 'Formação Acadêmica', style: 'sectionHeader' });
            //         content.push(...educationContent);
            //     }
            // }

            // if (formData.sections['Soft Skills']) {
            //     content.push({ text: 'Soft Skills', style: 'sectionHeader' });
            //     content.push({ text: formData.sections['Soft Skills'] });
            // }

            // if (formData.sections['Diferenciais']) {
            //     content.push({ text: 'Diferenciais', style: 'sectionHeader' });
            //     content.push({ text: formData.sections['Diferenciais'] });
            // }

            const pdfDoc = PDFDocument.createPdf({
                content: content,
                styles: {
                    header: {
                        fontSize: 24,
                        bold: true,
                        margin: [0, 0, 0, 8],
                        color: '#0D0126',
                    },
                    subheader: {
                        fontSize: 16,
                        bold: false,
                        margin: [0, 0, 0, 10],
                        color: '#FF66C4',
                    },
                    sectionHeader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 15, 0, 8],
                        color: '#FF66C4',
                    },
                    contactInfo: {
                        fontSize: 10,
                        marginBottom: 2,
                        color: '#1A1038',
                    },
                    experienceCompany: {
                        fontSize: 12,
                        bold: true,
                        color: '#1A1038',
                        margin: [0, 5, 0, 0],
                    },
                    experienceTitle: {
                        fontSize: 11,
                        italics: true,
                        color: '#1A1038',
                        margin: [0, 3, 0, 0],
                    },
                    experiencePeriod: {
                        fontSize: 10,
                        color: '#777',
                        margin: [0, 2, 0, 5],
                    },
                    experienceDescription: {
                        fontSize: 10,
                        color: '#333',
                        margin: [0, 0, 0, 8],
                    },
                    educationInstitution: {
                        fontSize: 12,
                        bold: true,
                        color: '#1A1038',
                        margin: [0, 5, 0, 0],
                    },
                    educationDegree: {
                        fontSize: 11,
                        italics: true,
                        color: '#1A1038',
                        margin: [0, 3, 0, 0],
                    },
                    educationPeriod: {
                        fontSize: 10,
                        color: '#777',
                        margin: [0, 2, 0, 5],
                    },
                    educationDescription: {
                        fontSize: 10,
                        color: '#333',
                        margin: [0, 0, 0, 8],
                    },
                    skillCategory: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 10, 0, 5],
                        color: '#1A1038',
                    },
                    skillSubcategoryText: {
                        fontSize: 11,
                        margin: [0, 2, 0, 2],
                        color: '#333',
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
            res.status(500).send('Erro ao gerar o PDF');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}