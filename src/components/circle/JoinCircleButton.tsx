import { integrations } from '@/config/integrations';
import { ButtonLink } from '@/components/ui/Button';
import { SampleButton } from '@/components/ui/SampleButton';

type Variant = 'primary' | 'mauve' | 'periwinkle' | 'blush';

/**
 * "Join the Circle" — links to `integrations.circle.joinUrl`. Falls back to a
 * non-functional draft button with the white X if that's ever unset again.
 */
export function JoinCircleButton({ variant = 'primary' }: { variant?: Variant }) {
  const { joinUrl } = integrations.circle;
  if (joinUrl) {
    return (
      <ButtonLink to={joinUrl} variant={variant}>
        Join the Circle
      </ButtonLink>
    );
  }
  return (
    <SampleButton variant={variant} showNote={false}>
      Join the Circle
    </SampleButton>
  );
}
