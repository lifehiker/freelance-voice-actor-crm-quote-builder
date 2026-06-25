import Link from "next/link";

interface UpgradeBannerProps {
  message: string;
  plan?: string;
}

export function UpgradeBanner({ message }: UpgradeBannerProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <p className="font-medium">{message}</p>
      <Link
        href="/pricing"
        className="mt-1 inline-block font-semibold underline hover:no-underline"
      >
        Upgrade your plan →
      </Link>
    </div>
  );
}
