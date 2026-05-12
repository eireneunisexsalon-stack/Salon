"use client";

import { signOut } from '../actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button 
      onClick={handleSignOut}
      disabled={loading}
      className="px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all"
    >
      {loading ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
