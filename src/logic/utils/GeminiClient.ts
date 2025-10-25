import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-pro",
    });
  }

  /**
   * Gemini'ye mesaj gönderir ve cevap alır
   * @param userMessage Kullanıcının mesajı
   * @param userContext Kullanıcı profil bilgileri (AI için context)
   * @returns AI'ın cevabı
   */
  async chat(userMessage: string, userContext: string): Promise<string> {
    try {
      // Context ve user message'ı birleştir
      const fullPrompt = `${userContext}

Bu kullanıcı profili bilgilerine göre, aşağıdaki soruya kişiselleştirilmiş, yardımcı ve motive edici bir cevap ver. Eğitim seviyesine ve hedeflerine uygun önerilerde bulun.

Kullanıcı Sorusu: ${userMessage}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new Error(`AI yanıt hatası: ${error.message || "Bilinmeyen hata"}`);
    }
  }

  /**
   * Basit mesaj gönderimi (context olmadan)
   * @param message Mesaj
   * @returns AI cevabı
   */
  async simpleChat(message: string): Promise<string> {
    try {
      const result = await this.model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new Error(`AI yanıt hatası: ${error.message || "Bilinmeyen hata"}`);
    }
  }
}

// Singleton instance
export const geminiClient = new GeminiClient();

