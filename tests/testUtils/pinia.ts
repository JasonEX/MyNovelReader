import { createPinia, setActivePinia } from 'pinia';

export function setupPinia(): void {
  setActivePinia(createPinia());
}
