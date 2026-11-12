import { useId, useRef, useState } from 'react';
import type { ImageAsset } from '@/content/types';
import { defaultSrc } from '@/lib/image';
import { uploadImage } from './images';
import { useStudioUser } from './context';
import { errorText } from './ui';
import styles from './studio.module.css';

/** Pick, upload, describe and remove one image. */
export function ImageField({
  value,
  onChange,
  label,
}: {
  value?: ImageAsset;
  onChange: (next: ImageAsset | undefined) => void;
  label: string;
}) {
  const user = useStudioUser();
  const input = useRef<HTMLInputElement>(null);
  const altId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(user, file, value?.alt ?? ''));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className={styles.image}>
      <span className={styles.label}>{label}</span>
      {value && (
        <img
          className={styles.imagePreview}
          src={defaultSrc(value)}
          alt=""
          width={value.thumb?.width ?? value.width}
          height={value.width && value.height && value.thumb ? Math.round((value.height * value.thumb.width) / value.width) : value.height}
        />
      )}
      <div className={styles.row}>
        <button type="button" className={styles.secondary} disabled={busy} onClick={() => input.current?.click()}>
          {busy ? 'Uploading…' : value ? 'Replace image' : 'Choose image'}
        </button>
        {value && !busy && (
          <button type="button" className={styles.quiet} onClick={() => onChange(undefined)}>
            Remove
          </button>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void pick(e.target.files?.[0])}
        />
      </div>
      {value && (
        <label className={styles.field} htmlFor={altId}>
          <span className={styles.label}>Describe the image for people who can’t see it</span>
          <input
            id={altId}
            className={styles.input}
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
          />
        </label>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
