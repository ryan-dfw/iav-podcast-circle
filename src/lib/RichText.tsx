import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { RichText as RichTextValue } from '@/content/types';

/** Renders the content model's inline rich text (plain / em / strong / link runs). */
export function RichText({ value }: { value: RichTextValue }) {
  if (typeof value === 'string') return <>{value}</>;
  return (
    <>
      {value.map((run, i) => {
        if (typeof run === 'string') return <Fragment key={i}>{run}</Fragment>;
        if ('em' in run) return <em key={i}>{run.em}</em>;
        if ('strong' in run) return <strong key={i}>{run.strong}</strong>;
        const isInternal = run.href.startsWith('/');
        return isInternal ? (
          <Link key={i} to={run.href}>
            {run.link}
          </Link>
        ) : (
          <a key={i} href={run.href} target="_blank" rel="noopener noreferrer">
            {run.link}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        );
      })}
    </>
  );
}
