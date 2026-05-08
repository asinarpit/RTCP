import { FileText, MoreVertical, Clock } from 'lucide-react';
import type { Document } from '../../types/document';

interface DocumentRowProps {
    doc: Document;
    onClick: () => void;
    onMenuClick: (e: React.MouseEvent) => void;
    isActiveMenu: boolean;
    onRename: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

const DocumentRow = ({ doc, onClick, onMenuClick, isActiveMenu, onRename, onDelete }: DocumentRowProps) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <tr 
            onClick={onClick}
            className="border-b border-paper-border/50 hover:bg-paper-bg cursor-pointer transition-colors group"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3 text-paper-ink">
                    <FileText size={14} className="text-paper-ink-muted group-hover:text-paper-accent" />
                    <span className="text-sm font-bold group-hover:text-paper-accent">{doc.title}</span>
                </div>
            </td>
            <td className="px-6 py-4 hidden sm:table-cell">
                <span className="text-[10px] font-mono text-paper-ink-muted opacity-40">0x{doc.id.slice(0, 12)}...</span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-paper-ink-muted">
                        <Clock size={10} />
                        <span>{formatDate(doc.updatedAt)}</span>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={onMenuClick}
                            className="p-1 hover:bg-paper-bg rounded-sm transition-colors text-paper-ink-muted cursor-pointer"
                        >
                            <MoreVertical size={14} />
                        </button>
                        {isActiveMenu && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-paper-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] z-30">
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
                </div>
            </td>
        </tr>
    );
};

export default DocumentRow;
