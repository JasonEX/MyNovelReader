import type { App } from 'vue';

declare global {
  interface Window {
    MNR_MOUNT_POINT?: string;
    MNR_VUE_APP?: App;
  }
}

export {};

