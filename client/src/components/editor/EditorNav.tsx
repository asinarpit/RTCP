import { ArrowLeft, FileText, Circle, Share2 } from 'lucide-react';

interface EditorNavProps {
    onBack: () => void;
    docTitle: string;
    status: string;
    user: any;
    onShare: () => void;
    showShareToast: boolean;
}

const EditorNav = ({ onBack, docTitle, status, user, onShare, showShareToast }: EditorNavProps) => {
    return (
        <nav className="border-b border-paper-border bg-white/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between h-14 items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-paper-ink-muted hover:text-paper-ink transition-colors border border-transparent hover:border-paper-border rounded-sm cursor-pointer"
                        >
                            <ArrowLeft size={14} />
                            <span className="hidden sm:inline">Exit_Session</span>
                        </button>
                        <div className="h-4 w-px bg-paper-border mx-1 sm:mx-2" />
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-paper-ink-muted shrink-0" />
                            <span className="text-xs font-black uppercase tracking-widest truncate max-w-[100px] sm:max-w-[200px]">{docTitle}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-paper-ink/5 rounded-full">
                            <Circle size={10} className={`${status === 'ready' ? 'fill-green-500 text-green-500' : 'fill-yellow-500 text-yellow-500'} animate-pulse`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-paper-ink-muted hidden xs:inline">{status}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 border-l border-paper-border pl-4 sm:pl-6 relative">
                            <div 
                                className="w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-bold text-white shadow-sm shrink-0"
                                style={{ backgroundColor: user?.color || "#1a1a1a" }}
                            >
                                {user?.name?.charAt(0)}
                            </div>
                            <Share2 
                                size={16} 
                                onClick={onShare}
                                className="text-paper-ink-muted hover:text-paper-ink cursor-pointer transition-colors active:scale-90" 
                            />
                            
                            {showShareToast && (
                                <div className="absolute top-10 right-0 py-2 px-4 bg-paper-ink text-white text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl whitespace-nowrap z-50">
                                    Link_Copied
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default EditorNav;
