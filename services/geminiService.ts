import { GoogleGenAI, Type } from "@google/genai";
import { CompetitionEntry } from "../types";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      binici: {
        type: Type.STRING,
        description: "Binicinin adı ve soyadı.",
      },
      kulup: {
        type: Type.STRING,
        description: "Binicinin üye olduğu kulüp.",
      },
      atinAdi: {
        type: Type.STRING,
        description: "Yarışmaya katılan atın adı.",
      },
      yukseklik: {
        type: Type.STRING,
        description: "Yarışma kategorisinin yüksekliği, birimiyle birlikte (örn: '100 cm').",
      },
    },
    required: ["binici", "kulup", "atinAdi", "yukseklik"],
  },
};

export const processPdf = async (pdfFile: File): Promise<CompetitionEntry[]> => {
  // @ts-ignore
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(pdfFile);

  const prompt = `Lütfen bu PDF dosyasındaki binicilik yarışması listesini analiz et. Tablodaki 'Binici', 'Kulüp', 'Atın Adı' ve 'Yüksekik' sütunlarındaki verileri çıkar ve JSON formatında listele. Yüksekliğin birimini de eklediğinden emin ol (örn: "cm").`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [imagePart, { text: prompt }],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
  
  try {
    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as CompetitionEntry[];
  } catch (e) {
    console.error("Gemini'den gelen JSON parse edilemedi:", response.text);
    throw new Error("Veri işlenirken bir hata oluştu. Lütfen PDF formatını kontrol edin.");
  }
};