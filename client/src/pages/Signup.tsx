import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { Command, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState("");
    
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const signupMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, data);
            return response.data;
        },
        onSuccess: (data) => {
            login(data.user, data.token);
            navigate("/dashboard");
        },
        onError: (error: any) => {
            setLocalError(error.response?.data?.message || "Registration failed");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");

        if (!name || !email || !password || !confirmPassword) {
            setLocalError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        signupMutation.mutate({ name, email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-paper-bg font-mono selection:bg-paper-accent/20">
            <div className="w-full max-w-[440px] relative">
                <div className="absolute -top-12 -left-4 flex items-center gap-3 opacity-20">
                    <Command size={32} />
                    <div className="flex flex-col">
                        <span className="font-black tracking-tighter text-xl">RTCP.SYS</span>
                    </div>
                </div>

                <div className="bg-white border-2 border-paper-ink p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-paper-accent mb-4">
                            <UserPlus size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">New Account</span>
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">Sign Up</h1>
                        <p className="text-[10px] font-bold text-paper-ink-muted uppercase tracking-widest leading-relaxed">Create a new profile to start collaborating in real-time.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-paper-ink-muted uppercase tracking-widest">Full Name</label>
                                <User size={12} className="text-paper-ink-muted/30" />
                            </div>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-4 bg-paper-bg border border-paper-border focus:border-paper-ink focus:outline-none transition-all text-xs font-bold uppercase tracking-wider placeholder:text-paper-ink-muted/20 shadow-inner"
                                placeholder="Your Name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-paper-ink-muted uppercase tracking-widest">Email Address</label>
                                <Mail size={12} className="text-paper-ink-muted/30" />
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 bg-paper-bg border border-paper-border focus:border-paper-ink focus:outline-none transition-all text-xs font-bold uppercase tracking-wider placeholder:text-paper-ink-muted/20 shadow-inner"
                                placeholder="name@email.com"
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-paper-ink-muted uppercase tracking-widest">Password</label>
                                    <Lock size={12} className="text-paper-ink-muted/30" />
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-paper-bg border border-paper-border focus:border-paper-ink focus:outline-none transition-all text-xs font-bold uppercase tracking-wider placeholder:text-paper-ink-muted/20 shadow-inner pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-ink-muted/30 hover:text-paper-ink transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-paper-ink-muted uppercase tracking-widest">Confirm</label>
                                    <Lock size={12} className="text-paper-ink-muted/30" />
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-4 bg-paper-bg border border-paper-border focus:border-paper-ink focus:outline-none transition-all text-xs font-bold uppercase tracking-wider placeholder:text-paper-ink-muted/20 shadow-inner pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-ink-muted/30 hover:text-paper-ink transition-colors cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {localError && (
                            <div className="p-4 bg-red-100 border border-red-600 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-1">
                                [!] Error: {localError}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={signupMutation.isPending}
                            className="w-full py-5 bg-paper-ink text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                        >
                            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-paper-border flex flex-col items-center gap-4">
                        <Link to="/login" className="text-[11px] font-black uppercase tracking-tighter hover:text-paper-accent transition-colors flex items-center gap-2">
                             Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
