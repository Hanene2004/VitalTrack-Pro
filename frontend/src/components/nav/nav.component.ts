import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [CommonModule],
    template: `
    <nav class="fixed left-0 top-0 bottom-0 w-20 bg-[#1e293b] border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50">
      <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
        <i class="fa-solid fa-shield-halved text-2xl"></i>
      </div>
      <div class="flex flex-col gap-6">
        <button 
          *ngFor="let item of navItems"
          (click)="selectTab.emit(item.id)"
          [title]="item.title"
          [class]="'w-12 h-12 rounded-2xl flex items-center justify-center transition-all ' + (activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300')"
        >
          <i [class]="'fa-solid ' + item.icon + ' text-lg'"></i>
        </button>
      </div>
    </nav>
  `
})
export class NavComponent {
    @Input() activeTab: string = 'overview';
    @Output() selectTab = new EventEmitter<string>();

    navItems = [
        { id: 'overview', icon: 'fa-chart-pie', title: "Vue d'ensemble" },
        { id: 'audit', icon: 'fa-magnifying-glass-chart', title: "Audit détaillé" },
        { id: 'import', icon: 'fa-file-import', title: "Import/Export" },
        { id: 'settings', icon: 'fa-gear', title: "Paramètres" }
    ];
}
