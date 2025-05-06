// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function run(
    jobDetails: string,
    textToModify: string,
    apiKey: string
) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const prompt = `
    Ananlise o texto abaixo, para que ele fique mais adequado a uma vaga de emprego;
    Modifique abaixo somente o textToModify para que corresponda aos requisitos do jobDetails;
    Não adicione coisas que não existam no textToModify, pois seria informação falsa;
    Nem deixe sugestões de como fnalizar, você deve finalizar o texto;
    Não faça perguntas, não deixe perguntas abertas;
    Nem insira links;
    Não deixe o texto mais longo, apenas mais curto;
    Deixar mais direto e objetivo;
    Mais sucinto;
    Não adicionar informações que não estão no texto original;
    Não adicionar inputs ou códigos;
    Apenas deixe que tenha mais a ver com os requisitos da vaga;

    Job Details: ${JSON.stringify(jobDetails)}

    Texto a ser modificado: ${textToModify}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}