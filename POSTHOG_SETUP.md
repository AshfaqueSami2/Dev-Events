# PostHog Setup Guide

## What's Configured
- PostHog JavaScript SDK is installed and configured
- Your project key: `phc_sB9sNK4EMPSlEndk1WmtwHmEboMLtVwrzS1VopiBcuq`
- US hosting endpoint: `https://us.i.posthog.com`
- Automatic page view tracking
- Error handling for adblockers

## Development Mode
PostHog is **disabled by default** in development to prevent console errors from adblockers.

You'll see: `🔍 PostHog disabled in development to avoid adblocker errors`

## Enable PostHog

### For Development
In `.env.local`, change:
```bash
NEXT_PUBLIC_ENABLE_POSTHOG=true
```

### For Production
Set these environment variables in your deployment platform:
```bash
NEXT_PUBLIC_ENABLE_POSTHOG=true
NEXT_PUBLIC_POSTHOG_KEY=phc_sB9sNK4EMPSlEndk1WmtwHmEboMLtVwrzS1VopiBcuq
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Usage Examples

### Track Custom Events
```tsx
import { usePostHog } from 'posthog-js/react'

function MyComponent() {
  const posthog = usePostHog()
  
  const handleClick = () => {
    posthog?.capture('button_clicked', {
      button_name: 'hero_cta',
      page: 'home'
    })
  }
  
  return <button onClick={handleClick}>Click me</button>
}
```

### Identify Users
```tsx
posthog?.identify('user_123', {
  email: 'user@example.com',
  name: 'John Doe'
})
```

## Troubleshooting

### net::ERR_BLOCKED_BY_CLIENT Errors
This is normal with adblockers. PostHog will still work for users without adblockers. The errors are:
- Harmless in development (hence why we disable it)
- Expected behavior - analytics tools are commonly blocked
- Won't affect your app's functionality

### Verifying PostHog Works
1. Set `NEXT_PUBLIC_ENABLE_POSTHOG=true`
2. Open browser without adblocker (incognito mode)
3. Look for `✅ PostHog loaded successfully` in console
4. Check PostHog dashboard for events