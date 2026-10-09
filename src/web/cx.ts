/** Склеить классы, пропуская пустые: cx('a', on && 'b', className) */
export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ');
