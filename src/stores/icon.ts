import { defineStore } from 'pinia';
import { ref } from 'vue';
import md5 from 'md5';

import type { IIcon } from '@/types/icon';

const baseUrl = 'https://upload.wikimedia.org/wikipedia/commons';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export const useIconStore = defineStore('icon', () => {
  const icons = ref<Record<string, IIcon>>({});

  function patch(name: string, icon: IIcon): void {
    icons.value = {
      ...icons.value,
      [name]: icon,
    };
  }

  function fetching(name: string): void {
    patch(name, { status: 'loading' });
  }

  function fetched(name: string, data: string) {
    patch(name, { status: 'ready', data, ratio: 1 });
  }

  function failed(name: string): void {
    patch(name, { status: 'failed' });
  }

  function resolved(name: string, ratio: number) {
    const icon = icons.value[name];
    if (!icon) return;
    patch(name, { ...icon, ratio });
  }

  async function resolve(name: string): Promise<void> {
    if (typeof icons.value[name] != 'undefined') {
      return;
    }

    fetching(name);

    try {
      const file = `BSicon_${name.replaceAll(' ', '_')}.svg`;
      const hash = md5(file);

      const res = await fetch(`${baseUrl}/${hash.substring(0, 1)}/${hash.substring(0, 2)}/${file}`);
      if (res.status < 200 || res.status >= 300) {
        failed(name);
        return;
      }

      const data = URL.createObjectURL(await res.blob());
      fetched(name, data);

      const img = await loadImage(data);
      const ratio = img.width / img.height;
      resolved(name, ratio);
    } catch (e) {
      console.error(e);
      failed(name);
    }
  }

  return { icons, resolve };
});
