import { Readable } from 'stream';
import { Observable } from 'rxjs';
import { ChatChunkStreamResponse } from '../../ai/types/stream';

export const observableToStream = (
  obs: Observable<ChatChunkStreamResponse>,
): Readable => {
  const readable = new Readable();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  readable._read = () => {};

  obs.subscribe({
    next: (data) => {
      // console.log('chunk', data);
      return readable.push(data.content);
    },
    error: (err) => readable.destroy(err),
    complete: () => readable.push(null),
  });

  return readable;
};
