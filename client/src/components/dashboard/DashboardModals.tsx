interface DashboardModalsProps {
    showCreate: boolean;
    setShowCreate: (show: boolean) => void;
    newTitle: string;
    setNewTitle: (title: string) => void;
    onCreate: () => void;
    editingDoc: { id: string, title: string } | null;
    setEditingDoc: (doc: { id: string, title: string } | null) => void;
    onRename: (doc: { id: string, title: string }) => void;
    deletingId: string | null;
    setDeletingId: (id: string | null) => void;
    onDelete: (id: string) => void;
    isCreating: boolean;
}

const DashboardModals = ({
    showCreate, setShowCreate, newTitle, setNewTitle, onCreate,
    editingDoc, setEditingDoc, onRename,
    deletingId, setDeletingId, onDelete,
    isCreating
}: DashboardModalsProps) => {
    return (
        <>
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper-ink/20 backdrop-blur-[2px]">
                    <div className="w-full max-w-md bg-white border-2 border-paper-ink p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-2 border-paper-ink pb-4">INIT_NEW_DOCUMENT</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-paper-ink-muted uppercase tracking-widest">MANIFEST_TITLE</label>
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Untitled Document..."
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-paper-bg border border-paper-border focus:border-paper-ink focus:outline-none transition-colors text-sm font-bold"
                                />
                            </div>
                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    onClick={onCreate}
                                    disabled={isCreating}
                                    className="w-full py-4 bg-paper-ink text-white font-black uppercase tracking-widest hover:bg-paper-ink/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden disabled:opacity-50 cursor-pointer"
                                >
                                    {isCreating ? 'PROCESS_INIT...' : 'CREATE_MANIFEST'}
                                </button>
                                <button onClick={() => setShowCreate(false)} className="text-[10px] font-bold uppercase tracking-widest text-paper-ink-muted cursor-pointer hover:text-paper-ink transition-colors">ABORT_OPERATION</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper-ink/20 backdrop-blur-[2px]">
                    <div className="w-full max-w-md bg-white border-2 border-paper-ink p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.15)]">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-2 border-paper-ink pb-4">RENAME_MANIFEST</h3>
                        <input
                            type="text"
                            value={editingDoc.title}
                            onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                            className="w-full px-4 py-3 bg-paper-bg border border-paper-border focus:border-paper-ink focus:outline-none transition-colors text-sm font-bold mb-6"
                        />
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => onRename(editingDoc)}
                                className="w-full py-4 bg-paper-ink text-white font-black uppercase tracking-widest hover:bg-paper-ink/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer"
                            >
                                UPDATE_IDENTIFIER
                            </button>
                            <button onClick={() => setEditingDoc(null)} className="text-[10px] font-bold uppercase tracking-widest text-paper-ink-muted cursor-pointer">CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-900/10 backdrop-blur-[2px]">
                    <div className="w-full max-w-md bg-white border-2 border-red-600 p-8 shadow-[12px_12px_0px_0px_rgba(220,38,38,0.15)]">
                        <h3 className="text-xl font-black text-red-600 uppercase tracking-tighter mb-4">PURGE_MANIFEST?</h3>
                        <p className="text-xs text-paper-ink-muted mb-8 uppercase tracking-wider leading-relaxed">This operation is irreversible. All collaborative data for this terminal will be permanently deleted from the buffer.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => onDelete(deletingId)}
                                className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.1)] cursor-pointer"
                            >
                                CONFIRM_PURGE
                            </button>
                            <button onClick={() => setDeletingId(null)} className="text-[10px] font-bold uppercase tracking-widest text-paper-ink-muted cursor-pointer">RETAIN_DATA</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardModals;
