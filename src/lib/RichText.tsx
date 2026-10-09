import { Fragment } from 'react';
import type { RichText as RichTextValue } from '@/content/types';

/** Renders the content model's inline rich text (plain / em / strong runs). */
export function RichText({ value }: { value: RichTextValue }) {
  if (typeof value === 'string') return <>{value}</>;
  return (
    <>
      {value.map((run, i) => {
        if (typeof run === 'string') return <Fragment key={i}>{run}</Fragment>;
        if ('em' in run) return <em key={i}>{run.em}</em>;
        return <strong key={i}>{run.strong}</strong>;
      })}
    </>
  );
}
