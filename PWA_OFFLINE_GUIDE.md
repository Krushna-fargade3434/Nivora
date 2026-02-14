# PWA & Offline Support

## Overview
Scriblet is now a Progressive Web App (PWA) with full offline support. This means you can:
- Install it as a standalone app on any device
- Use it without an internet connection
- Get automatic updates when new versions are available
- Experience faster loading times through intelligent caching

## Technical Implementation

### Service Worker
The app uses Workbox-powered service worker with the following caching strategies:

1. **Static Assets** (CacheFirst)
   - JavaScript, CSS, HTML files
   - Images (PNG, JPG, SVG)
   - Fonts (WOFF, WOFF2)
   - Cached for optimal performance

2. **Google Fonts** (CacheFirst)
   - Font stylesheets from fonts.googleapis.com
   - Font files from fonts.gstatic.com
   - 1-year cache expiration

3. **Images** (CacheFirst)
   - All image assets
   - 30-day cache expiration
   - Maximum 60 entries

### Configuration
PWA configuration is in `vite.config.ts`:
```typescript
VitePWA({
  registerType: "autoUpdate",
  manifest: { /* ... */ },
  workbox: { /* caching strategies */ }
})
```

### Components

**OfflineIndicator.tsx**
- Shows visual feedback when offline
- Displays "back online" message when connection restored
- Auto-hides after 3 seconds when back online

**useOnlineStatus.ts**
- Custom hook to detect online/offline state
- Can be used in any component that needs online status

**OfflinePage.tsx**
- Fallback page for offline navigation
- Shows what features are available offline
- Provides retry button

## Installation Guide

### Desktop Installation
1. Visit Scriblet in a supported browser (Chrome, Edge, Brave)
2. Click the install icon in the address bar
3. Click "Install" in the prompt
4. Scriblet launches as a standalone app

### Mobile Installation (Android)
1. Open Scriblet in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen" or "Install App"
4. Tap "Install"

### Mobile Installation (iOS)
1. Open Scriblet in Safari
2. Tap the Share button (⬆️)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

## Offline Capabilities

### What Works Offline
- ✅ View previously loaded pages
- ✅ Browse cached notes
- ✅ Navigate between pages
- ✅ View cached images
- ✅ Access static content

### What Requires Internet
- ❌ Create new notes
- ❌ Edit existing notes
- ❌ Sync with Supabase
- ❌ Authentication
- ❌ Load new data

## Updates

### Automatic Updates
The service worker automatically checks for updates. When a new version is available:
1. A popup notification appears
2. User clicks "Reload" to update
3. App updates to latest version
4. Cache refreshes with new assets

### Manual Updates
To force an update:
1. Unregister the service worker in DevTools
2. Clear browser cache
3. Reload the page

## Development

### Testing PWA Locally
```bash
npm run build
npm run preview
```

### Testing Offline
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Refresh the page

### Debugging Service Worker
1. Open DevTools
2. Go to Application tab
3. Select "Service Workers" in sidebar
4. View registered workers and their status

## Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅      | ✅     |
| Edge    | ✅      | ✅     |
| Safari  | ✅      | ✅     |
| Firefox | ✅      | ✅     |
| Opera   | ✅      | ✅     |

## Troubleshooting

### Service Worker Not Registering
- Ensure HTTPS is enabled (or using localhost)
- Check browser console for errors
- Verify `vite-plugin-pwa` is installed

### App Not Installing
- Check if browser supports PWA installation
- Ensure manifest.webmanifest is accessible
- Verify icons are correct size and format

### Offline Mode Not Working
- Clear cache and rebuild
- Check service worker registration
- Verify caching strategies in config

### Updates Not Applying
- Unregister old service worker
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

## Best Practices

1. **Cache Invalidation**: Service worker updates automatically on deployment
2. **Asset Optimization**: Images and fonts are cached efficiently
3. **Fallback Routes**: Navigation fallback ensures smooth offline experience
4. **User Feedback**: Offline indicator keeps users informed
5. **Progressive Enhancement**: Core functionality works offline, enhanced features require connection

## Future Enhancements

Potential improvements for offline experience:
- IndexedDB for offline data storage
- Background sync for pending changes
- Offline drafts for new notes
- Conflict resolution for sync
- Push notifications
