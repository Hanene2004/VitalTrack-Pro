import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction, AnomalyResult, AppState } from '../models/types';
import { calculateZScoreAnomalies, parseCSV } from '../shared/utils';
import { GeminiService } from './gemini.service';

const SAMPLE_DATA: Transaction[] = [
    { id: '1', date: '2024-05-01', amount: 1200, category: 'Ventes', description: 'Vente client A', timestamp: 1714521600000 },
    { id: '2', date: '2024-05-02', amount: 50, category: 'Fournitures', description: 'Papeterie Bureau Vallée', timestamp: 1714608000000 },
    { id: '3', date: '2024-05-03', amount: 8500, category: 'Marketing', description: 'Campagne Google Ads Mai', timestamp: 1714694400000 },
    { id: '4', date: '2024-05-04', amount: 1500, category: 'Ventes', description: 'Vente prestation consulting', timestamp: 1714780800000 },
    { id: '5', date: '2024-05-05', amount: 2200, category: 'Loyer', description: 'Loyer local commercial', timestamp: 1714867200000 },
];

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private state = new BehaviorSubject<AppState>({
        // BizGuard AI
        transactions: [],
        anomalies: [],
        summary: null,
        // VitalTrack Pro (Default/Empty)
        meals: [],
        profile: null,
        streak: 0,
        achievements: [],
        dailySummary: null,
        aiSuggestions: [],
        // Elite Sport & Performance
        workouts: [],
        performanceMetrics: null,
        recoveryScore: 100
    });

    state$ = this.state.asObservable();
    isAnalyzing$ = new BehaviorSubject<boolean>(false);
    isCategorizing$ = new BehaviorSubject<boolean>(false);

    constructor(private geminiService: GeminiService) {
        this.loadInitialData();
    }

    private loadInitialData() {
        const saved = localStorage.getItem('bizguard_data');
        if (saved) {
            this.updateState({ transactions: JSON.parse(saved) });
        } else {
            this.updateState({ transactions: SAMPLE_DATA });
        }
    }

    private updateState(partialState: Partial<AppState>) {
        const newState = { ...this.state.value, ...partialState };
        this.state.next(newState);
        localStorage.setItem('bizguard_data', JSON.stringify(newState.transactions));
    }

    async runFullAudit() {
        const { transactions } = this.state.value;
        if (transactions.length === 0) return;

        this.isAnalyzing$.next(true);
        try {
            const statAnomalies = calculateZScoreAnomalies(transactions);
            const aiResult = await this.geminiService.detectAnomaliesWithAI(transactions);

            const merged = aiResult.anomalies.map((ai: AnomalyResult) => {
                const stat = statAnomalies.find((s: AnomalyResult) => s.transactionId === ai.transactionId);
                return { ...ai, isStatisticalAnomaly: !!stat?.isStatisticalAnomaly };
            });

            this.updateState({ anomalies: merged, summary: aiResult.summary });
        } catch (error) {
            console.error(error);
            alert("L'analyse IA a échoué.");
        } finally {
            this.isAnalyzing$.next(false);
        }
    }

    async autoCategorize() {
        const { transactions } = this.state.value;
        if (transactions.length === 0) return;

        this.isCategorizing$.next(true);
        try {
            const suggestions = await this.geminiService.classifyTransactions(transactions);
            const updatedTransactions = transactions.map((t: Transaction) => {
                const suggestion = suggestions.find((s: { id: string, category: string }) => s.id === t.id);
                return suggestion ? { ...t, category: suggestion.category as any } : t;
            });
            this.updateState({ transactions: updatedTransactions });
        } catch (error) {
            console.error(error);
            alert("La catégorisation NLP a échoué.");
        } finally {
            this.isCategorizing$.next(false);
        }
    }

    importCSV(csvText: string) {
        const data = parseCSV(csvText);
        this.updateState({ transactions: [...data, ...this.state.value.transactions] });
    }

    resetData() {
        this.updateState({ transactions: [], anomalies: [], summary: null });
    }

    loadDemo() {
        this.updateState({ transactions: SAMPLE_DATA, anomalies: [], summary: null });
    }

    editTransaction(updated: Transaction) {
        const transactions = this.state.value.transactions.map((t: Transaction) => t.id === updated.id ? updated : t);
        this.updateState({ transactions });
    }

    exportToCSV() {
        const { transactions, anomalies } = this.state.value;
        const header = "ID,Date,Montant,Catégorie,Description,Score Risque,Diagnostic\n";
        const rows = transactions.map((t: Transaction) => {
            const a = anomalies.find((anom: AnomalyResult) => anom.transactionId === t.id);
            return `"${t.id}","${t.date}",${t.amount},"${t.category}","${t.description}",${a?.suspicionScore || 0},"${(a?.reason || '').replace(/"/g, '""')}"`;
        }).join("\n");

        const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `audit_bizguard_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
