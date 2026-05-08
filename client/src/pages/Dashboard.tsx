import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/auth.store";
import type { Document } from "../types/document";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStatusBar from "../components/dashboard/DashboardStatusBar";
import DocumentCard from "../components/dashboard/DocumentCard";
import DocumentRow from "../components/dashboard/DocumentRow";
import DashboardModals from "../components/dashboard/DashboardModals";
import EmptyState from "../components/dashboard/EmptyState";

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, token, logout } = useAuthStore();
    const [newTitle, setNewTitle] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [editingDoc, setEditingDoc] = useState<{ id: string, title: string } | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const api = axios.create({
        baseURL: API,
        headers: { Authorization: `Bearer ${token}` },
    });

    const { data: documents, isLoading, isError } = useQuery({
        queryKey: ["documents"],
        queryFn: async () => {
            const res = await api.get("/documents");
            return res.data.documents as Document[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (title: string) => {
            const res = await api.post("/documents", { title });
            return res.data.document as Document;
        },
        onSuccess: (doc) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            setShowModal(false);
            setNewTitle("");
            navigate(`/document/${doc.id}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, title }: { id: string, title: string }) => {
            const res = await api.patch(`/documents/${id}`, { title });
            return res.data.document as Document;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            setEditingDoc(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/documents/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            setDeletingId(null);
        },
    });

    const handleCreate = () => {
        const title = newTitle.trim() || "Untitled Document";
        createMutation.mutate(title);
    };

    const filteredDocuments = documents?.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-paper-bg flex flex-col items-center justify-center font-mono p-12">
                <div className="w-full max-w-md space-y-4">
                    <div className="flex justify-between text-[10px] font-bold text-paper-ink-muted uppercase tracking-widest">
                        <span>Loading_Buffer...</span>
                        <span>0%</span>
                    </div>
                    <div className="h-2 w-full bg-paper-border relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-paper-ink animate-[loading_1.5s_infinite_ease-in-out]" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div className="min-h-screen bg-paper-bg flex items-center justify-center font-mono text-red-600 font-bold uppercase tracking-widest p-12">Session_Sync_Failure: ERROR_ID_0x0042</div>;
    }

    return (
        <div className="min-h-screen bg-paper-bg font-mono text-paper-ink selection:bg-paper-accent/20">
            <DashboardHeader 
                userName={user?.name || "GUEST"}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNewDocument={() => setShowModal(true)}
                onLogout={logout}
            />

            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-12">
                <DashboardStatusBar 
                    count={filteredDocuments?.length || 0}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {(!filteredDocuments || filteredDocuments.length === 0) ? (
                    <EmptyState 
                        onNewDocument={() => setShowModal(true)} 
                        isSearching={searchQuery.length > 0} 
                    />
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDocuments?.map((doc) => (
                            <DocumentCard 
                                key={doc.id}
                                doc={doc}
                                onClick={() => navigate(`/document/${doc.id}`)}
                                onMenuClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                                }}
                                isActiveMenu={activeMenuId === doc.id}
                                onRename={(e) => {
                                    e.stopPropagation();
                                    setEditingDoc({ id: doc.id, title: doc.title });
                                    setActiveMenuId(null);
                                }}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    setDeletingId(doc.id);
                                    setActiveMenuId(null);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="border border-paper-border bg-white shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-paper-bg/50 border-b border-paper-border text-[10px] font-bold uppercase tracking-widest text-paper-ink-muted">
                                    <th className="px-6 py-4">Descriptor</th>
                                    <th className="px-6 py-4 hidden sm:table-cell">Identity_Buffer</th>
                                    <th className="px-6 py-4 text-right">Last_Manifest</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments?.map((doc) => (
                                    <DocumentRow 
                                        key={doc.id}
                                        doc={doc}
                                        onClick={() => navigate(`/document/${doc.id}`)}
                                        onMenuClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                                        }}
                                        isActiveMenu={activeMenuId === doc.id}
                                        onRename={(e) => {
                                            e.stopPropagation();
                                            setEditingDoc({ id: doc.id, title: doc.title });
                                            setActiveMenuId(null);
                                        }}
                                        onDelete={(e) => {
                                            e.stopPropagation();
                                            setDeletingId(doc.id);
                                            setActiveMenuId(null);
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <DashboardModals 
                showCreate={showModal}
                setShowCreate={setShowModal}
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                onCreate={handleCreate}
                editingDoc={editingDoc}
                setEditingDoc={setEditingDoc}
                onRename={(doc) => updateMutation.mutate(doc)}
                deletingId={deletingId}
                setDeletingId={setDeletingId}
                onDelete={(id) => deleteMutation.mutate(id)}
                isCreating={createMutation.isPending}
            />

            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
