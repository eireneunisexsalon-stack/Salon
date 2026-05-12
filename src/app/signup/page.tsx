"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function SignupContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Account created! Please check your email for a confirmation link.");
      const redirectTo = searchParams.get('redirectTo');
      router.push(redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : '/login');
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black tracking-[0.1em] mb-4 inline-block">
            EIRENE<span className="text-gold">SALON</span>
          </Link>
          <h1 className="text-2xl font-bold text-white uppercase italic tracking-tight">Create <span className="text-gold">Account</span></h1>
          <p className="text-gray-500 text-xs tracking-widest uppercase mt-2">Join our premium community</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs text-center uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2 ml-1">Full Name</label>
                <input 
                  name="fullName"
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-gold transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2 ml-1">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-gold transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2 ml-1">Password</label>
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-gold transition-all text-sm" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gold text-black font-black rounded-xl disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
            Already have an account? <Link href={searchParams.get('redirectTo') ? `/login?redirectTo=${encodeURIComponent(searchParams.get('redirectTo') as string)}` : '/login'} className="text-gold font-bold hover:underline">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>}>
      <SignupContent />
    </Suspense>
  );
}
