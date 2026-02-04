
import { GoogleGenAI, Type } from "@google/genai";
import { Delegate, Chamber, Faction, ElectionResult } from "../types";

export const getAIAnalysis = async (
  delegates: Delegate[], 
  chambers: Chamber[], 
  factions: Faction[],
  history: ElectionResult[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const context = {
    delegates: delegates.map(d => ({ 
      chamberId: d.chamberId, 
      status: d.status, 
      risk: d.riskScore, 
      group: d.currentGroup 
    })),
    chambers: chambers.map(c => ({ name: c.name, total: c.totalDelegates })),
    factions: factions.map(f => ({ id: f.id, name: f.name })),
    history: history.map(h => ({ chamberId: h.chamberId, year: h.year, votes: h.votes, factionId: h.factionId }))
  };

  const prompt = `
    Sen TÜMDEP 2028 Seçim Strateji Masası için bir Kıdemli Veri Analisti ve Sistem Mimarı'sın.
    Aşağıdaki delege, oda ve tarihsel sonuç verilerini analiz et.
    
    HESAPLAMA STANDARDI:
    W (Ağırlıklı Oy) = Durum * Zaman * Risk * Oda
    Risk Skoru (R) = (Vazgeçme_Oranı * 0.4) + (Temas_Eksikliği * 0.6)
    
    ANALİZ İSTEKLERİ:
    1. Executive Summary: 460-480 oy bandı hedefi için durumu özetle.
    2. Büyüme Analizi: Tarihsel trend (2020 vs 2024) ve 2028 projeksiyonu.
    3. Grup Geçiş Analizi: Mevcut rakiplerden (özellikle Çağdaşlar) TÜMDEP'e oy kayma olasılığını değerlendir.
    4. Senaryo Motoru: "İttifaklar", "Katılım Artışı" ve "Rakip Dağılması" senaryoları üret.

    Veriler: ${JSON.stringify(context)}

    Yanıtı kesinlikle JSON olarak, audit_ready formatta ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            prediction: { type: Type.STRING },
            riskSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedVotes2028: { type: Type.NUMBER },
            weightedTotalVotes: { type: Type.NUMBER },
            microGrowthTargets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  chamber: { type: Type.STRING },
                  potentialGain: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                }
              }
            },
            scenarios: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  predictedVotes: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            algorithmAuditLog: { type: Type.STRING },
            factionTransitionAnalysis: { type: Type.STRING }
          },
          required: ["executiveSummary", "prediction", "riskSummary", "strategicSuggestions", "estimatedVotes2028", "weightedTotalVotes", "microGrowthTargets", "scenarios", "algorithmAuditLog", "factionTransitionAnalysis"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Strategic Analysis Error:", error);
    return null;
  }
};
