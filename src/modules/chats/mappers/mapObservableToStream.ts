import { Readable } from 'stream';
import { Observable } from 'rxjs';

export const observableToStream = <T>(obs: Observable<T>): Readable => {
  const readable = new Readable();

  obs.subscribe({
    next: (data) => readable.push(data),
    error: (err) => readable.destroy(err),
    complete: () => readable.push(null),
  });

  return readable;
};
