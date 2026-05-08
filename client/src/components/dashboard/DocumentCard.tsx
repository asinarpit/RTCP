import { FileText, MoreVertical, Clock, ChevronRight } from 'lucide-react';
import type { Document } from '../../types/document';

interface DocumentCardProps {
    doc: Document;
    onClick: () => void;
    onMenuClick: (e: React.MouseEvent) => void;
    isActiveMenu: boolean;
    onRename: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

const DocumentCard = ({ doc, onClick, onMenuClick, isActiveMenu, onRename, onDelete }: DocumentCardProps) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div 
            onClick={onClick}
            className="group relative bg-white border border-paper-border p-5 cursor-pointer hover:border-paper-ink transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1"
        >
            <div className="absolute top-0 right-0 z-20">
                <button 
                    onClick={onMenuClick}
                    className="w-10 h-10 flex items-center justify-center border-l border-b border-paper-border bg-paper-bg group-hover:bg-paper-ink/5 transition-all text-paper-ink-muted hover:text-paper-ink cursor-pointer"
                >
                    <div className="rotate-[135deg]">
                        <MoreVertical size={14} />
                    </div>
                </button>
                
                {isActiveMenu && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-paper-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] z-30">
                        <button 
                            onClick={onRename}
                            className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-paper-bg transition-colors border-b border-paper-border cursor-pointer"
                        >
                            Rename
                        </button>
                        <button 
                            onClick={onDelete}
                            className="text-white w-full text-left px-3 py-2 text-[10px] font-bold uppercase bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col h-full pt-2">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-paper-bg rounded-sm text-paper-ink">
                        <FileText size={20} />
                    </div>
                </div>
                
                <h3 className="text-base font-bold mb-6 line-clamp-2 leading-tight group-hover:text-paper-accent transition-colors">
                    {doc.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-paper-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-paper-ink-muted">
                        <Clock size={12} />
                        <span>{formatDate(doc.updatedAt)}</span>
                    </div>
                    <ChevronRight size={14} className="text-paper-ink-muted group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
