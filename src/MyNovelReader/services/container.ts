export class ServiceContainer {
  private static instance: ServiceContainer;

  private services: Map<string, unknown> = new Map();

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!this.instance) {
      this.instance = new ServiceContainer();
    }

    return this.instance;
  }

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    if (!this.services.has(name)) {
      throw new Error(`Service "${name}" has not been registered`);
    }

    return this.services.get(name) as T;
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  unregister(name: string): void {
    this.services.delete(name);
  }
}
