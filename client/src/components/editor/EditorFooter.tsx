import { useEffect, useState } from 'react';

interface EditorFooterProps {
    editor: any;
}

const EditorFooter = ({ editor }: EditorFooterProps) => {
    const [, setUpdate] = useState(0);

    useEffect(() => {
        if (!editor) return;
        const handler = () => setUpdate(prev => prev + 1);
        editor.on("transaction", handler);
        return () => editor.off("transaction", handler);
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="p-4 border-t border-paper-border/30 flex justify-between items-center text-[9px] font-bold text-paper-ink-muted uppercase tracking-widest">
            <span>Terminal_Session_EST_2026</span>
            <div className="flex gap-4">
                <span>Words: {editor.storage.characterCount.words()}</span>
                <span>Chars: {editor.storage.characterCount.characters()}</span>
            </div>
        </div>
    );
};

export default EditorFooter;
