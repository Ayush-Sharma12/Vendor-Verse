import { cn } from '@/lib/utils';

type Fit = 'cover' | 'contain';

export default function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  fit = 'contain',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fit?: Fit;
  priority?: boolean;
}) {
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-black/5', className)}>
      {/* Blurred backdrop so "contain" never looks like empty space */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
        loading={priority ? 'eager' : 'lazy'}
      />
      <img
        src={src}
        alt={alt}
        className={cn('absolute inset-0 w-full h-full', fitClass, 'object-center', imgClassName)}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

