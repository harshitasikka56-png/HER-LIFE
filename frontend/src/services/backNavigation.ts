import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export type BackHandlerFn = () => boolean | Promise<boolean>;

export interface BackRegistration {
  id: string;
  priority: number;
  handler: BackHandlerFn;
}

// Global registry of back handlers sorted by priority (higher priority runs first)
const backHandlers: BackRegistration[] = [];
let isInitialized = false;

/**
 * Register a back handler.
 * @param id Unique identifier for the handler
 * @param priority Number (higher number runs earlier, e.g. 100 for exit dialog, 80 for modals, 40 for tabs)
 * @param handler Function returning true if it handled/consumed the back action, false otherwise
 * @returns Unsubscribe function
 */
export function registerBackHandler(
  id: string,
  priority: number,
  handler: BackHandlerFn
): () => void {
  const existingIdx = backHandlers.findIndex((h) => h.id === id);
  if (existingIdx >= 0) {
    backHandlers[existingIdx] = { id, priority, handler };
  } else {
    backHandlers.push({ id, priority, handler });
  }

  return () => {
    const idx = backHandlers.findIndex((h) => h.id === id);
    if (idx >= 0) {
      backHandlers.splice(idx, 1);
    }
  };
}

/**
 * Execute the back action through registered handlers in priority order.
 * Returns true if a handler consumed the event, false otherwise.
 */
export async function triggerBack(): Promise<boolean> {
  // Sort descending by priority
  const sorted = [...backHandlers].sort((a, b) => b.priority - a.priority);

  for (const item of sorted) {
    try {
      const handled = await item.handler();
      if (handled) {
        return true;
      }
    } catch (e) {
      console.error(`Error in back handler "${item.id}":`, e);
    }
  }

  return false;
}

/**
 * Native app exit helper.
 */
export async function exitHerLifeApp(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await CapApp.exitApp();
    } catch (e) {
      console.warn('CapApp.exitApp error:', e);
    }
  } else {
    console.log('App would exit on native platform');
  }
}

/**
 * Initialize global Android system back button listener and window history popstate.
 */
export function initBackNavigation(): () => void {
  if (isInitialized) return () => {};
  isInitialized = true;

  // 1. Capacitor Native Android Back Button Listener (Hardware button + system back gesture)
  let capListenerRemove: (() => void) | null = null;
  if (Capacitor.isNativePlatform()) {
    CapApp.addListener('backButton', async (event) => {
      const handled = await triggerBack();
      if (!handled) {
        // If nothing handled it, exit app
        await exitHerLifeApp();
      }
    }).then((handle) => {
      capListenerRemove = () => handle.remove();
    }).catch((err) => {
      console.warn('Capacitor backButton listener init error:', err);
    });
  }

  // 2. Browser/WebView History PopState (Swipe navigation / browser Back)
  const handlePopState = async (e: PopStateEvent) => {
    // Re-push state so popstate doesn't automatically unload the page
    window.history.pushState({ herLifeNav: true, ts: Date.now() }, document.title);
    await triggerBack();
  };

  // Push an initial entry so popstate fires on swipe back
  try {
    window.history.pushState({ herLifeNav: true, ts: Date.now() }, document.title);
  } catch (e) {
    // ignore
  }
  window.addEventListener('popstate', handlePopState);

  // 3. Fallback Escape key for testing on desktop browser
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      triggerBack();
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    isInitialized = false;
    if (capListenerRemove) capListenerRemove();
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * React hook to register a back handler for a component while mounted and enabled.
 */
export function useBackHandler(
  id: string,
  priority: number,
  handler: BackHandlerFn,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;
    const unregister = registerBackHandler(id, priority, handler);
    return unregister;
  }, [id, priority, handler, enabled]);
}
