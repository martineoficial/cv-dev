import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";

interface GoogleAIError {
    status?: number;
    message?: string;
}

export async function run(
    jobDetails: string,
    textToModify: string,
    apiKey: string
): Promise<string> {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
    PERSONA: Recrutador Tech Sênior e Especialista em ATS. Você é a própria candidata refinando o próprio currículo para uma vaga específica.
    TAREFA: Refine o "Texto a ser modificado" para alinhar aos "Job Details" fornecidos.
    
    REGRAS DE OURO (ESTRITAS):
    1. PRIMEIRA PESSOA: Escreva sempre na primeira pessoa do singular. Use verbos como "Desenvolvi", "Liderei", "Arquitetuei", "Implementei" (jamais use a terceira pessoa como "Desenvolveu" ou "Liderou").
    2. SEM MARKDOWN: Proibido o uso de asteriscos (*), negritos (**) ou links.
    3. LISTAS: Para listas, use apenas o hífen simples (-) no início da linha.
    4. SUCINTO: Remova adjetivos vazios. Foque em resultados, tecnologias e métricas.
    5. ATS: Integre as palavras-chave dos "Job Details" de forma natural no texto.
    6. LIMPEZA: Retorne APENAS o texto final. Sem introduções, comentários ou aspas.

    Job Details: ${JSON.stringify(jobDetails)}
    Texto a ser modificado: ${textToModify}
    
    Resposta (Texto em primeira pessoa, sem markdown):`;

    try {
        const result: GenerateContentResult = await model.generateContent(prompt);
        let cleanedText = result.response.text().trim();

        // Remove resquícios de markdown caso a IA ignore o prompt
        cleanedText = cleanedText.replace(/\*\*/g, '').replace(/\*/g, '');
        
        // Garante que não existam aspas cercando o texto todo
        if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
            cleanedText = cleanedText.substring(1, cleanedText.length - 1);
        }

        return cleanedText;
    } catch (error) {
        const err = error as GoogleAIError;
        // Fallback para o modelo estável 2.5
        if (err.status === 503 || err.status === 429) {
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const retryResult: GenerateContentResult = await fallbackModel.generateContent(prompt);
            return retryResult.response.text().trim().replace(/\*\*/g, '').replace(/\*/g, '');
        }
        throw new Error(err.message || "Erro na comunicação com a IA");
    }
}