export type Ok<T> = {
  success: true;
  data?: T;
};

export type Err<E> = {
  success: false;
  error: E;
};

export const Result = {
  ok: <T>(data?: T): Ok<T> => ({ data, success: true }),
  err: <E>(error: E): Err<E> => ({ success: false, error }),
};
