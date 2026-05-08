import { FilePlus } from 'lucide-react';

interface EmptyStateProps {
    onNewDocument: () => void;
    isSearching: boolean;
}

const EmptyState = ({ onNewDocument, isSearching }: EmptyStateProps) => {
    return (
        <div className="bg-white border-2 border-dashed border-paper-border p-20 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-paper-bg rounded-sm text-paper-ink-muted/20 mb-6">
                <FilePlus size={48} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">
                {isSearching ? 'No match found' : 'No documents yet'}
            </h3>
            <p className="text-[10px] font-bold text-paper-ink-muted uppercase tracking-[0.2em] mb-8 max-w-xs leading-relaxed">
                {isSearching 
                    ? 'We couldn\'t find any documents matching your search. Try adjusting your keywords.' 
                    : 'You haven\'t created any documents. Get started by creating your first one below.'}
            </p>
            {!isSearching && (
                <button 
                    onClick={onNewDocument}
                    className="px-8 py-4 bg-paper-ink text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
                >
                    Create Your First Document
                </button>
            )}
        </div>
    );
};

export default EmptyState;
