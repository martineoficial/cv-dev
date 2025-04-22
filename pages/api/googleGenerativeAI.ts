// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function run(
    jobDetails: string,
    textToModify: string,
    apiKey: string
) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Modifique somente abaixo o texto a ser modificado, para que corresponda aos requisitos do jobDetails, não adicione tecnologias que não existam, nem insira links, fique a vontade para alterar, deixar mais direto e objetivo, mais sucinto, apenas deixe que tenha mais a ver com os requisitos da vaga.
    Job Details: ${JSON.stringify(jobDetails)}
    Texto a ser modificado: ${textToModify}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}