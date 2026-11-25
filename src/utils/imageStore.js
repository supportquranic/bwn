// src/utils/imageStore.js
// Centralized image store for managing custom image overrides with localStorage persistence

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bm_custom_images';

// Get raw dictionary from localStorage
export function getStoredOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading image overrides from localStorage:', e);
    return {};
  }
}

// Get single image with fallback
export function getImage(key, fallbackUrl) {
  const overrides = getStoredOverrides();
  return overrides[key] || fallbackUrl;
}

// Set custom image override
export function setImage(key, value) {
  try {
    const overrides = getStoredOverrides();
    if (!value) {
      delete overrides[key];
    } else {
      overrides[key] = value;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new Event('bm_images_changed'));
  } catch (e) {
    console.error('Failed to save image to localStorage:', e);
  }
}

// Remove override
export function resetImage(key) {
  setImage(key, null);
}

// Reset all overrides
export function resetAllImages() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('bm_images_changed'));
  } catch (e) {
    console.error('Failed to clear image overrides:', e);
  }
}

// React Hook to subscribe to image changes
export function useCustomImages() {
  const [overrides, setOverrides] = useState(getStoredOverrides);

  useEffect(() => {
    const handler = () => {
      setOverrides(getStoredOverrides());
    };
    window.addEventListener('bm_images_changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('bm_images_changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const getImg = (key, fallback) => overrides[key] || fallback;

  return { overrides, getImg, setImage, resetImage, resetAllImages };
}
