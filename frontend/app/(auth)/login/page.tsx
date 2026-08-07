"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { login } from "@/services/auth.service";

const schema = z.object({ email: z.string().email(), password: z.string().min(6), remember: z.boolean().optional() });
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const submit = async (values: FormValues) => {
    setError("");
    const response = await login({ email: values.email, password: values.password }).catch((err) => {
      setError(err.response?.data?.message || "Unable to login");
      return null;
    });
    if (!response) return;
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    router.push("/dashboard");
  };
  return <main className="grid min-h-screen bg-gray-50 lg:grid-cols-[1.1fr_0.9fr]"><section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,.45),transparent_34%),linear-gradient(135deg,#020617,#1e293b)]" /><div className="relative flex items-center gap-3"><div className="grid size-11 place-items-center rounded-lg bg-blue-600 font-bold">P</div><span className="text-lg font-bold">Pilot Records</span></div><div className="relative max-w-xl"><ShieldCheck className="mb-6 size-14 text-blue-300" /><h1 className="text-5xl font-bold tracking-normal">Secure school records, beautifully organized.</h1><p className="mt-5 text-lg leading-8 text-slate-300">A centralized administrative database for admissions, staff records, academic sessions, reporting, and long-term institutional history.</p></div><div className="relative grid grid-cols-3 gap-3 text-sm text-slate-300"><div className="rounded-lg border border-white/10 bg-white/5 p-4">JWT security</div><div className="rounded-lg border border-white/10 bg-white/5 p-4">Role access</div><div className="rounded-lg border border-white/10 bg-white/5 p-4">Audit-ready</div></div></section><section className="flex items-center justify-center p-5"><Card className="w-full max-w-md p-7"><div className="mb-8"><div className="mb-4 grid size-12 place-items-center rounded-lg bg-blue-600 font-bold text-white">P</div><h2 className="text-2xl font-bold text-slate-950">Welcome back</h2><p className="mt-1 text-sm text-slate-500">Sign in with your administrative account.</p></div><form className="space-y-4" onSubmit={handleSubmit(submit)}><label className="block text-sm font-medium text-slate-700">Email<Input className="mt-2" type="email" placeholder="admin@pilot.test" {...register("email")} /></label><label className="block text-sm font-medium text-slate-700">Password<Input className="mt-2" type="password" placeholder="Enter password" {...register("password")} /></label><label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="size-4 rounded border-gray-300 text-blue-600" {...register("remember")} />Remember me</label>{error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}<Button className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader /> : <LockKeyhole className="size-4" />}Login</Button></form></Card></section></main>;
}
