'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

interface ExtendedFormData {
  email: string;
  password: string;
  userType: string;
  name?: string;
}

export async function login(formData: ExtendedFormData) {
  const supabase = await createClient()

  const { email, password } = formData;

  const data = {
    email,
    password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const errorMessage = encodeURIComponent(error.message);
    redirect(`/error?message=${errorMessage}`);
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
