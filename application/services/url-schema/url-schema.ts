interface Route<T extends Array<unknown>> {
  pattern: string;
  resolve(...args: T): string;
}

export type InferParams<T extends keyof UrlSchema> = Parameters<
  ReturnType<UrlSchema[T]>['resolve']
>;

export class UrlSchema {
  public constructor(private readonly params: { version: number }) {}

  public pasta(): Route<[]> {
    return {
      pattern: `/v${this.params.version}/pasta`,
      resolve() {
        return this.pattern;
      },
    };
  }

  public pastaById(): Route<[string]> {
    return {
      pattern: `/v${this.params.version}/pasta/id/{id}`,
      resolve: (id) => {
        return `/v${this.params.version}/pasta/id/${id}`;
      },
    };
  }

  public pastaFrom(): Route<[number]> {
    return {
      pattern: `/v${this.params.version}/pasta/{from}`,
      resolve: (from) => {
        return `/v${this.params.version}/pasta/${from}`;
      },
    };
  }

  public pastaFromLimit(): Route<[number, number]> {
    return {
      pattern: `/v${this.params.version}/pastas/{from}/{limit}`,
      resolve: (from, limit) => {
        return `/v${this.params.version}/pastas/${from}/${limit}`;
      },
    };
  }
}
