import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, FileText, Circle, Share2, Download } from 'lucide-react';

interface EditorNavProps {
    onBack: () => void;
    docTitle: string;
    status: string;
    onShare: () => void;
    showShareToast: boolean;
    onDownload: (format: "txt" | "html" | "md") => void;
    collaborators?: { id: number; name: string; color: string }[];
}

const EditorNav = ({ onBack, docTitle, status, onShare, showShareToast, onDownload, collaborators = [] }: EditorNavProps) => {
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDownloadMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
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
                        
                        <div className="flex items-center gap-3 border-l border-paper-border pl-4 sm:pl-6 relative">
                            <div className="flex -space-x-1.5 items-center mr-1">
                                {collaborators.slice(0, 4).map((c) => (
                                    <div 
                                        key={c.id}
                                        className="w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-white shrink-0 uppercase cursor-default select-none relative group"
                                        style={{ backgroundColor: c.color }}
                                    >
                                        {c.name.charAt(0)}
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-paper-ink text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                            {c.name}
                                        </div>
                                    </div>
                                ))}
                                {collaborators.length > 4 && (
                                    <div className="w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-bold text-paper-ink bg-paper-bg border border-paper-ink shadow-sm shrink-0 uppercase cursor-default select-none relative group">
                                        +{collaborators.length - 4}
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-paper-ink text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                            {collaborators.slice(4).map(c => c.name).join(', ')}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Share2 
                                size={16} 
                                onClick={onShare}
                                className="text-paper-ink-muted hover:text-paper-ink cursor-pointer transition-colors active:scale-90" 
                            />

                            <div className="relative flex items-center" ref={dropdownRef}>
                                <Download 
                                    size={16} 
                                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                                    className="text-paper-ink-muted hover:text-paper-ink cursor-pointer transition-colors active:scale-90" 
                                />
                                
                                {showDownloadMenu && (
                                    <div className="absolute right-0 top-8 bg-white border-2 border-paper-ink py-2 w-48 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-1 text-[8px] font-black text-paper-ink-muted border-b border-paper-border uppercase tracking-widest mb-1.5">
                                            Export_Format
                                        </div>
                                        <button
                                            onClick={() => {
                                                onDownload("txt");
                                                setShowDownloadMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[10px] font-black hover:bg-paper-bg hover:text-paper-accent transition-colors uppercase tracking-widest cursor-pointer"
                                        >
                                            .txt (Plain Text)
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDownload("html");
                                                setShowDownloadMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[10px] font-black hover:bg-paper-bg hover:text-paper-accent transition-colors uppercase tracking-widest cursor-pointer"
                                        >
                                            .html (Web Page)
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDownload("md");
                                                setShowDownloadMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[10px] font-black hover:bg-paper-bg hover:text-paper-accent transition-colors uppercase tracking-widest cursor-pointer"
                                        >
                                            .md (Markdown)
                                        </button>
                                    </div>
                                )}
                            </div>
                            
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
