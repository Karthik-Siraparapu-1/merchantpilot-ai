'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, ArrowRight, Lock, Mail, Building2, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useAuth } from '@/features/auth/auth-context';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid work email address'),
  merchantName: z.string().min(2, 'Merchant organization name must be at least 2 characters'),
  merchantSlug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

type RegisterFormData = z.infer<typeof registerSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      merchantName: '',
      merchantSlug: '',
      password: ''
    }
  });

  const merchantSlug = watch('merchantSlug');

  const handleMerchantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('merchantName', val, { shouldValidate: true });
    setValue('merchantSlug', slugify(val), { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerAuth(data);
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/80 shadow-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center lg:hidden mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create your AI Commerce Workspace
        </CardTitle>
        <CardDescription className="text-xs">
          Launch your AI-powered commerce operating system in under 60 seconds.
        </CardDescription>
      </CardHeader>

      <div className="px-6 pb-2">
        {/* Enterprise SSO Options */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-9 font-normal flex items-center justify-center gap-1.5"
            onClick={() => {
              setValue('firstName', 'Karthik');
              setValue('lastName', 'Siraparapu');
              setValue('email', 'karthik@merchantpilot.ai');
              setValue('merchantName', 'Karthik Commerce Pvt Ltd');
              setValue('merchantSlug', 'karthik-commerce');
              setValue('password', 'Password123!');
            }}
            title="Autofill Karthik credentials"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-9 font-normal flex items-center justify-center gap-1.5"
            onClick={() => {
              setValue('firstName', 'Karthik');
              setValue('lastName', 'Siraparapu');
              setValue('email', 'karthik@merchantpilot.ai');
              setValue('merchantName', 'Karthik Commerce Pvt Ltd');
              setValue('merchantSlug', 'karthik-commerce');
              setValue('password', 'Password123!');
            }}
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            GitHub
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-9 font-normal flex items-center justify-center gap-1.5"
            onClick={() => {
              setValue('firstName', 'Karthik');
              setValue('lastName', 'Siraparapu');
              setValue('email', 'karthik@merchantpilot.ai');
              setValue('merchantName', 'Karthik Commerce Pvt Ltd');
              setValue('merchantSlug', 'karthik-commerce');
              setValue('password', 'Password123!');
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
              <path fill="#f25022" d="M1 1h10v10H1z" />
              <path fill="#7fba00" d="M13 1h10v10H13z" />
              <path fill="#00a4ef" d="M1 13h10v10H1z" />
              <path fill="#ffb900" d="M13 13h10v10H13z" />
            </svg>
            Entra ID
          </Button>
        </div>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-2 text-muted-foreground font-mono">
              Or register with email
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <CardContent className="space-y-3 pt-0">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground" htmlFor="firstName">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="Karthik"
                  className="pl-8 text-xs"
                  error={!!errors.firstName}
                  {...register('firstName')}
                />
              </div>
              {errors.firstName && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground" htmlFor="lastName">
                Last Name
              </label>
              <Input
                id="lastName"
                placeholder="Siraparapu"
                className="text-xs"
                error={!!errors.lastName}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground" htmlFor="email">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="karthik@merchantpilot.ai"
                className="pl-8 text-xs"
                error={!!errors.email}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Merchant Organization Name */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground" htmlFor="merchantName">
              Merchant / Brand Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="merchantName"
                placeholder="Karthik Commerce Pvt Ltd"
                className="pl-8 text-xs"
                error={!!errors.merchantName}
                onChange={handleMerchantNameChange}
              />
            </div>
            {errors.merchantName && (
              <p className="text-[10px] text-destructive font-medium">
                {errors.merchantName.message}
              </p>
            )}
          </div>

          {/* Merchant Slug & Live Preview */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground" htmlFor="merchantSlug">
                Storefront Slug
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                {merchantSlug
                  ? `${merchantSlug}.merchantpilot.app`
                  : 'karthik-commerce.merchantpilot.app'}
              </span>
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="merchantSlug"
                placeholder="karthik-commerce"
                className="pl-8 font-mono text-xs"
                error={!!errors.merchantSlug}
                {...register('merchantSlug')}
              />
            </div>
            {errors.merchantSlug && (
              <p className="text-[10px] text-destructive font-medium">
                {errors.merchantSlug.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground" htmlFor="password">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                className="pl-8 text-xs"
                error={!!errors.password}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-destructive font-medium">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Launch AI Commerce Workspace <ArrowRight className="ml-1 h-4 w-4" />
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Already have a merchant account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
