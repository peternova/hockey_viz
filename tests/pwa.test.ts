import { describe, expect, it } from 'vitest';
import { platformOf } from '../src/lib/pwa';

const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  iphoneChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Mobile/15E148 Safari/604.1',
  ipadDesktopMode:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
  android:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
  samsung:
    'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36',
  windows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  linux: 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
};

describe('platformOf (which install steps to show first)', () => {
  it('spots iPhones, including Chrome on iPhone', () => {
    expect(platformOf(UA.iphone)).toBe('ios');
    expect(platformOf(UA.iphoneChrome)).toBe('ios');
  });

  it('treats a touch-screen "Mac" as an iPad, and a real Mac as a laptop', () => {
    expect(platformOf(UA.ipadDesktopMode, 5)).toBe('ios');
    expect(platformOf(UA.ipadDesktopMode, 0)).toBe('desktop');
  });

  it('spots Android, including Samsung Internet', () => {
    expect(platformOf(UA.android, 5)).toBe('android');
    expect(platformOf(UA.samsung, 5)).toBe('android');
  });

  it('defaults to laptop/desktop', () => {
    expect(platformOf(UA.windows)).toBe('desktop');
    expect(platformOf(UA.linux)).toBe('desktop');
    expect(platformOf('')).toBe('desktop');
  });
});
