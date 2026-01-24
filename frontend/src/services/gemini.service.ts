import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Transaction, AnomalyResult, Category } from "../models/types";

@Injectable({
    providedIn: 'root'
})
export class GeminiService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        // En environnement réel, l'API KEY ne devrait pas être accessible ainsi au frontend
        const apiKey = (window as any).process?.env?.API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Détecte les anomalies contextuelles et statistiques via Gemini.
     */
    async detectAnomaliesWithAI(transactions: Transaction[]): Promise<{ anomalies: AnomalyResult[], summary: string }> {
        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        anomalies: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    transactionId: { type: SchemaType.STRING },
                                    suspicionScore: { type: SchemaType.NUMBER, description: "Score de 0 à 1" },
                                    reason: { type: SchemaType.STRING },
                                    isStatisticalAnomaly: { type: SchemaType.BOOLEAN }
                                },
                                required: ["transactionId", "suspicionScore", "reason"]
                            }
                        },
                        summary: { type: SchemaType.STRING, description: "Résumé global de la santé financière" }
                    },
                    required: ["anomalies", "summary"]
                }
            },
        });

        const prompt = `En tant qu'expert en audit financier, analyse ces transactions pour un petit business. 
        Identifie les anomalies (fraudes potentielles, erreurs de saisie, dépenses atypiques).
        
        Transactions: ${JSON.stringify(transactions.slice(0, 50))}`;

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    /**
     * Utilise le NLP pour classer automatiquement les transactions.
     */
    async classifyTransactions(transactions: Transaction[]): Promise<{ id: string, category: Category }[]> {
        const categories: Category[] = ['Ventes', 'Fournitures', 'Salaire', 'Loyer', 'Marketing', 'Divers'];

        const model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            id: { type: SchemaType.STRING },
                            category: { type: SchemaType.STRING, enum: categories } as any
                        },
                        required: ["id", "category"]
                    }
                }
            },
        });

        const prompt = `Analyse les descriptions des transactions suivantes et attribue la catégorie la plus appropriée parmi : ${categories.join(', ')}.
        
        Transactions: ${JSON.stringify(transactions.map(t => ({ id: t.id, desc: t.description })))};`;

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    }
}
