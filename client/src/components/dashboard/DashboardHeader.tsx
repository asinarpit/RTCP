import { Command, Search, Plus, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
    userName: string;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onNewDocument: () => void;
    onLogout: () => void;
}

const DashboardHeader = ({ userName, searchQuery, onSearchChange, onNewDocument, onLogout }: DashboardHeaderProps) => {
    return (
        <header className="border-b-2 border-paper-ink bg-white/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-paper-ink text-white">
                            <Command size={24} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black uppercase tracking-tighter leading-none">RTCP.SYS</h1>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-md mx-12">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-paper-ink text-paper-ink-muted/30" size={16} />
                            <input
                                type="text"
                                placeholder="SEARCH_MANIFEST_INDEX..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full bg-paper-bg border border-paper-border px-12 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-paper-ink transition-all placeholder:text-paper-ink-muted/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <button 
                            onClick={onNewDocument}
                            className="flex items-center gap-2 bg-paper-ink text-white p-3 sm:px-6 sm:py-3 font-black uppercase tracking-widest text-[11px] hover:bg-paper-ink/90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">NEW_MANIFEST</span>
                        </button>
                        
                        <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-paper-border">
                            <div className="hidden xs:flex flex-col items-end">
                                <span className="text-[10px] font-bold text-paper-ink-muted uppercase">User</span>
                                <span className="text-xs font-black uppercase truncate max-w-[80px]">{userName}</span>
                            </div>
                            <button 
                                onClick={onLogout}
                                className="p-2 text-paper-ink-muted hover:text-red-600 transition-colors cursor-pointer"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
