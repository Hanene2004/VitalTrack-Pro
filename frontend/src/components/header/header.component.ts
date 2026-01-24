import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutritionService } from '../../services/nutrition.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <h1 class="text-4xl font-black tracking-tight text-white mb-2">VitalTrack <span class="text-emerald-500">AI</span></h1>
        <p class="text-slate-400 font-medium italic font-mono text-sm opacity-80 uppercase tracking-tighter">Votre intelligence nutritionnelle personnelle par IA.</p>
      </div>
      <div class="flex gap-4">
        <button 
          class="px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 border border-white/10 bg-slate-800 hover:bg-slate-700 active:scale-95"
        >
          <i class="fa-solid fa-camera"></i>
          Photo Sync
        </button>
        <button 
          (click)="ns.runAIPatternAnalysis()"
          [disabled]="(ns.isAnalyzing$ | async)"
          class="px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-2xl bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 active:scale-95 disabled:bg-slate-700 disabled:animate-pulse"
        >
          <i [class]="(ns.isAnalyzing$ | async) ? 'fa-solid fa-spinner animate-spin' : 'fa-solid fa-wand-magic-sparkles'"></i>
          Analyse IA
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
    constructor(public ns: NutritionService) { }
}
