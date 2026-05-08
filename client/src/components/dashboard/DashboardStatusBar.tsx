import { LayoutGrid, List } from 'lucide-react';

interface DashboardStatusBarProps {
    count: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const DashboardStatusBar = ({ count, viewMode, setViewMode }: DashboardStatusBarProps) => {
    return (
        <div className="flex justify-between items-center py-6 border-b border-paper-border mb-8 text-[10px] font-bold text-paper-ink-muted uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3 sm:gap-6">
                <span>{String(count).padStart(3, '0')}_ITEMS</span>
                <div className="h-3 w-px bg-paper-border" />
                <span className="hidden sm:inline">Storage: CLOUD_SYNC</span>
            </div>
            <div className="flex gap-2">
                <LayoutGrid 
                    size={12} 
                    onClick={() => setViewMode("grid")}
                    className={`cursor-pointer transition-colors ${viewMode === "grid" ? "text-paper-ink" : "text-paper-ink-muted/30 hover:text-paper-ink-muted"}`} 
                />
                <List 
                    size={12} 
                    onClick={() => setViewMode("list")}
                    className={`cursor-pointer transition-colors ${viewMode === "list" ? "text-paper-ink" : "text-paper-ink-muted/30 hover:text-paper-ink-muted"}`} 
                />
            </div>
        </div>
    );
};

export default DashboardStatusBar;
