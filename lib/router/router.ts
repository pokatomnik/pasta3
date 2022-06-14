import { NextApiRequest, NextApiResponse } from 'next';
import trim from 'lodash/trim';
import type { Controller } from './controller';

interface IMatchFound {
  found: true;
  params: Record<string, string>;
}

interface IMatchNotFound {
  found: false;
}

type Match = IMatchFound | IMatchNotFound;

export class Router {
  private static patternParams = {
    CHAR_START: '{',
    CHAR_END: '}',
    ALL_PATTERN_CHARS: '{}',
    PATH_SEPARATOR: '/',
  };

  private readonly handlers = new Map<string, Controller>();

  public constructor(
    private readonly params: {
      notFoundHandler: Controller;
    }
  ) {}

  public addHandler(this: this, pattern: string, handler: Controller): this {
    this.handlers.set(pattern, handler);
    return this;
  }

  private static patternPartToKey(patternPart: string) {
    return trim(patternPart, Router.patternParams.ALL_PATTERN_CHARS);
  }

  private static isPatternPart(part: string) {
    return part.startsWith('{') && part.endsWith('}');
  }

  private static getParams(
    partA: string,
    partB: string
  ): Record<string, string> | null {
    if (partA === partB) {
      return {};
    }
    if (Router.isPatternPart(partA) && !Router.isPatternPart(partB)) {
      return { [Router.patternPartToKey(partA)]: partB };
    }
    if (!Router.isPatternPart(partA) && Router.isPatternPart(partB)) {
      return { [Router.patternPartToKey(partB)]: partA };
    }
    return null;
  }

  private static getMatch(pattern: string, path: string): Match {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return { found: false };
    }

    const length = Math.round((pathParts.length + pathParts.length) / 2);

    const params: Record<string, string> = {};

    for (let i = 0; i < length; ++i) {
      const currentPatternPart = patternParts[i];
      const currentPathPart = pathParts[i];
      if (currentPatternPart === undefined || currentPathPart === undefined) {
        return { found: false };
      }

      const currentParams = Router.getParams(
        currentPatternPart,
        currentPathPart
      );
      if (currentParams === null) {
        return { found: false };
      }

      Object.assign(params, currentParams);
    }

    return { found: true, params };
  }

  public nextHandler(
    this: this,
    path: string
  ): (request: NextApiRequest, response: NextApiResponse) => void {
    for (const [pattern, controller] of this.handlers.entries()) {
      const match = Router.getMatch(pattern, path);
      if (match.found) {
        return (request, response) => {
          request.query = match.params;
          const handlerFn = controller.internalHandle();
          handlerFn(request, response);
        };
      }
    }
    return (request, response) => {
      const handlerFn = this.params.notFoundHandler.internalHandle();
      handlerFn(request, response);
    };
  }

  public notFoundHandler(
    this: this
  ): (request: NextApiRequest, response: NextApiResponse) => void {
    return (request, response) => {
      const handlerFn = this.params.notFoundHandler.internalHandle();
      handlerFn(request, response);
    };
  }
}
