// app/providers.tsx
'use client'

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_ENABLE_POSTHOG === 'true'
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    
    if (!enabled) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 PostHog disabled in development to avoid adblocker errors')
        console.log('   Set NEXT_PUBLIC_ENABLE_POSTHOG=true in .env.local to enable')
      }
      return
    }

    if (!key) {
      console.warn('PostHog enabled but NEXT_PUBLIC_POSTHOG_KEY is missing')
      return
    }

    try {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        loaded: (posthog) => {
          console.log('✅ PostHog loaded successfully')
        }
      })
    } catch (e) {
      console.error('❌ PostHog init failed:', e)
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
