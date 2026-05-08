import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import CharacterCount from '@tiptap/extension-character-count'
import * as Y from "yjs";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/auth.store";
import * as awarenessProtocol from 'y-protocols/awareness.js'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Monitor } from "lucide-react";
import MenuBar from "../components/editor/MenuBar";
import EditorFooter from "../components/editor/EditorFooter";
import EditorNav from "../components/editor/EditorNav";

const API = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const EditorPage = () => {
    const { id: documentId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuthStore();
    const [status, setStatus] = useState("connecting");
    const [showShareToast, setShowShareToast] = useState(false);

    const { data: docData } = useQuery({
        queryKey: ["document", documentId],
        queryFn: async () => {
            const res = await axios.get(`${API}/documents/${documentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data.document;
        },
        enabled: !!documentId && !!token
    });

    const docTitle = docData?.title || "Loading...";

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
    };

    const ydoc = useMemo(() => new Y.Doc(), []);
    const awareness = useMemo(() => new awarenessProtocol.Awareness(ydoc), [ydoc]);
    const socket = useMemo(() => {
        return io(SOCKET_URL, {
            auth: { token }
        });
    }, [token]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // @ts-ignore
                history: false,
            }),
            Collaboration.configure({
                document: ydoc,
            }),
            CollaborationCaret.configure({
                provider: { awareness },
                user: {
                    name: user?.name || "Guest",
                    color: user?.color || "#1a1a1a",
                },
            }),
            CharacterCount,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[800px] text-paper-ink p-6 sm:p-12 md:p-20 font-mono selection:bg-paper-accent/20',
            },
        },
    }, [awareness, user]);

    useEffect(() => {
        if (!documentId || !socket) return;

        socket.emit("join-document", documentId);

        socket.on("load-document", (binary: Uint8Array) => {
            Y.applyUpdate(ydoc, new Uint8Array(binary));
            setStatus("ready");
        });

        socket.on("sync-update", (update: Uint8Array) => {
            Y.applyUpdate(ydoc, new Uint8Array(update));
        });

        const handleDocUpdate = (update: Uint8Array, origin: any) => {
            if (origin !== "remote") {
                socket.emit("sync-update", { documentId, update });
            }
        };
        ydoc.on("update", handleDocUpdate);

        socket.on("awareness-update", (update: Uint8Array) => {
            awarenessProtocol.applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
        });

        const handleAwarenessUpdate = ({ added, updated, removed }: any) => {
            const changedClients = added.concat(updated).concat(removed);
            const update = awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients);
            socket.emit("awareness-update", { documentId, update });
        };
        awareness.on("update", handleAwarenessUpdate);

        return () => {
            ydoc.off("update", handleDocUpdate);
            awareness.off("update", handleAwarenessUpdate);
            socket.off("load-document");
            socket.off("sync-update");
            socket.off("awareness-update");
            socket.disconnect();
        };
    }, [documentId, socket, ydoc, awareness]);

    if (!token) return <div className="min-h-screen flex items-center justify-center font-mono uppercase tracking-[0.5em] text-red-600 font-black">UNAUTHORIZED_ACCESS</div>;

    return (
        <div className="min-h-screen font-mono text-paper-ink selection:bg-paper-accent/20 bg-paper-bg">
            <EditorNav 
                onBack={() => navigate("/dashboard")}
                docTitle={docTitle}
                status={status}
                user={user}
                onShare={handleShare}
                showShareToast={showShareToast}
            />

            <main className="max-w-5xl mx-auto py-6 sm:py-12 px-3 sm:px-4 space-y-6 sm:space-y-8">
                <div className="flex justify-between items-end border-b border-paper-ink pb-4">
                    <div className="space-y-1">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter truncate max-w-[180px] sm:max-w-xl">{docTitle}</h2>
                    </div>
                    <div className="flex gap-4 text-[10px] font-bold text-paper-ink-muted uppercase">
                        <div className="flex items-center gap-1.5">
                            <Monitor size={12} />
                            <span className="hidden xs:inline">SYNC_ACTIVE</span>
                        </div>
                    </div>
                </div>

                <div className="relative bg-white border border-paper-border shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] sm:shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] min-h-[800px] sm:min-h-[1000px] flex flex-col group transition-all">
                    <MenuBar editor={editor} />
                    
                    <div className="flex-1 overflow-hidden relative">
                        <div className="absolute inset-x-0 h-full pointer-events-none opacity-[0.03]" 
                             style={{backgroundImage: 'repeating-linear-gradient(#000 0 1px, transparent 1px 32px)', backgroundAttachment: 'local'}}>
                        </div>
                        <EditorContent editor={editor} />
                    </div>

                    <EditorFooter editor={editor} />
                </div>
                
                <div className="flex items-center gap-4 py-8 opacity-20 hover:opacity-100 transition-opacity cursor-default">
                    <div className="h-px flex-1 bg-paper-ink" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">End_Of_Manifest</span>
                    <div className="h-px flex-1 bg-paper-ink" />
                </div>
            </main>

            <style>{`
                .tiptap h1 { @apply text-4xl font-black mb-6 mt-10 tracking-tighter uppercase border-b-2 border-paper-ink pb-2; }
                .tiptap h2 { @apply text-2xl font-black mb-4 mt-8 tracking-tight uppercase; }
                .tiptap p { @apply text-base leading-relaxed mb-4; }
                .tiptap ul, .tiptap ol { @apply my-6 ml-6; }
                .tiptap li { @apply mb-2; }
                .tiptap blockquote { @apply border-l-4 border-paper-ink pl-4 italic my-6; }
                .tiptap ::selection { background-color: var(--color-paper-accent); color: white; }
            `}</style>
        </div>
    );
};

export default EditorPage;
