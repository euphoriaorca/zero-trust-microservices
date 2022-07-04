export declare type ClassType<T> = {
  new (...args: any[]): T;
  [x: string]: any;
};

export type TransformClassType<T> = T & {
  [x: string]: any;
};
