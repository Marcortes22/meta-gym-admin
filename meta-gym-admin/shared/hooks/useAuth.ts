'use client'

import { supabase } from '@/shared/api/supabase/client'
import { useEffect, useState } from 'react'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useSupabase() {
  return supabase
}

export function useUser() {
  const supabase = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  // No renderizar nada hasta que esté mounted para evitar hidratación
  if (!mounted) {
    return { user: null, loading: true, setUser: () => {} }
  }

  return { user, loading, setUser }
}

export function useAuth() {
  const supabase = useSupabase()
  const { user, loading, setUser } = useUser()

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign in catch error:', error)
      return { data: null, error: error as Error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
      }
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error as Error }
    }
  }

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Check auth error:', error)
        return null
      }
      setUser(user)
      return user
    } catch (error) {
      console.error('Check auth catch error:', error)
      return null
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    checkAuth,
  }
}