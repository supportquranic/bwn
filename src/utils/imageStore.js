// src/utils/imageStore.js
// Centralized store for managing custom images, product text, prices, and labels

import { useState, useEffect } from 'react';

const CONTENT_STORAGE_KEY = 'bm_custom_content';
const OLD_IMAGES_KEY = 'bm_custom_images';

// Get all stored content overrides
export function getStoredContent() {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    const content = raw ? JSON.parse(raw) : {};

    // Backward compatibility: migrate any old image-only keys if present
    const oldRaw = localStorage.getItem(OLD_IMAGES_KEY);
    if (oldRaw) {
      try {
        const oldImages = JSON.parse(oldRaw);
        Object.keys(oldImages).forEach(key => {
          if (!content[key]) {
            content[key] = { image: oldImages[key] };
          } else if (!content[key].image) {
            content[key].image = oldImages[key];
          }
        });
      } catch (err) {}
    }

    return content;
  } catch (e) {
    console.error('Error reading custom content from localStorage:', e);
    return {};
  }
}

// Get single image with fallback
export function getImage(key, fallbackUrl) {
  const content = getStoredContent();
  return content[key]?.image || fallbackUrl;
}

// Get full card item data (image, name, price, badge, etc.) with fallbacks
export function getItemData(key, defaultData = {}) {
  const content = getStoredContent();
  const custom = content[key] || {};
  return {
    ...defaultData,
    ...custom,
    image: custom.image || defaultData.image,
    name: custom.name !== undefined ? custom.name : defaultData.name,
    price: custom.price !== undefined ? custom.price : defaultData.price,
    badge: custom.badge !== undefined ? custom.badge : defaultData.badge,
    title: custom.title !== undefined ? custom.title : defaultData.title,
    subtitle: custom.subtitle !== undefined ? custom.subtitle : defaultData.subtitle,
    tag: custom.tag !== undefined ? custom.tag : defaultData.tag,
    label: custom.label !== undefined ? custom.label : defaultData.label,
    address: custom.address !== undefined ? custom.address : defaultData.address,
  };
}

// Set custom card data
export function setItemData(key, newData) {
  try {
    const content = getStoredContent();
    if (!newData) {
      delete content[key];
    } else {
      content[key] = {
        ...(content[key] || {}),
        ...newData,
      };
    }
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event('bm_content_changed'));
  } catch (e) {
    console.error('Failed to save content to localStorage:', e);
  }
}

// Legacy set image helper
export function setImage(key, imageUrl) {
  setItemData(key, { image: imageUrl });
}

// Reset specific key
export function resetItem(key) {
  try {
    const content = getStoredContent();
    delete content[key];
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event('bm_content_changed'));
  } catch (e) {
    console.error('Failed to reset item:', e);
  }
}

export function resetImage(key) {
  resetItem(key);
}

// Reset all overrides
export function resetAllContent() {
  try {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    localStorage.removeItem(OLD_IMAGES_KEY);
    window.dispatchEvent(new Event('bm_content_changed'));
  } catch (e) {
    console.error('Failed to clear custom content:', e);
  }
}

export function resetAllImages() {
  resetAllContent();
}

// React Hook to subscribe to content changes across the app
export function useCustomContent() {
  const [content, setContent] = useState(getStoredContent);

  useEffect(() => {
    const handler = () => {
      setContent(getStoredContent());
    };
    window.addEventListener('bm_content_changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('bm_content_changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const getImg = (key, fallback) => content[key]?.image || fallback;
  
  const getItem = (key, defaultData = {}) => {
    const custom = content[key] || {};
    return {
      ...defaultData,
      ...custom,
      image: custom.image || defaultData.image,
      name: custom.name !== undefined ? custom.name : defaultData.name,
      price: custom.price !== undefined ? custom.price : defaultData.price,
      badge: custom.badge !== undefined ? custom.badge : defaultData.badge,
      title: custom.title !== undefined ? custom.title : defaultData.title,
      subtitle: custom.subtitle !== undefined ? custom.subtitle : defaultData.subtitle,
      tag: custom.tag !== undefined ? custom.tag : defaultData.tag,
      label: custom.label !== undefined ? custom.label : defaultData.label,
      address: custom.address !== undefined ? custom.address : defaultData.address,
    };
  };

  return {
    content,
    getImg,
    getItem,
    setItemData,
    setImage,
    resetItem,
    resetImage,
    resetAllContent,
    resetAllImages,
  };
}

// Backward compatible export
export const useCustomImages = useCustomContent;
