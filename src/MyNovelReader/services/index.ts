import { ServiceContainer } from './container';
import { DefaultDomService } from './domService';
import { DefaultHttpService } from './httpService';
import { DefaultStorageService } from './storageService';
import type { DomService } from './domService';
import type { HttpService } from './httpService';
import type { StorageService } from './storageService';

export const SERVICE_KEYS = {
  DOM: 'dom',
  STORAGE: 'storage',
  HTTP: 'http',
} as const;

export type ServiceKey = (typeof SERVICE_KEYS)[keyof typeof SERVICE_KEYS];

export function registerDefaultServices(
  container = ServiceContainer.getInstance()
): ServiceContainer {
  if (!container.has(SERVICE_KEYS.DOM)) {
    container.register<DomService>(SERVICE_KEYS.DOM, new DefaultDomService());
  }

  if (!container.has(SERVICE_KEYS.STORAGE)) {
    container.register<StorageService>(SERVICE_KEYS.STORAGE, new DefaultStorageService());
  }

  if (!container.has(SERVICE_KEYS.HTTP)) {
    container.register<HttpService>(SERVICE_KEYS.HTTP, new DefaultHttpService());
  }

  return container;
}

registerDefaultServices();

export { ServiceContainer, DefaultDomService, DefaultStorageService, DefaultHttpService };
export type { DomService, StorageService, HttpService };
