import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-foreground text-2xl font-bold">Page not found</h1>
      <p className="text-muted mt-3 text-sm leading-relaxed">
        This business or page does not exist. Check the link or browse the directory.
      </p>
      <Link
        href="/businesses"
        className="bg-primary text-primary-foreground mt-8 inline-flex min-h-11 items-center rounded-lg px-5 py-2.5 text-sm font-semibold no-underline hover:opacity-90"
      >
        Browse businesses
      </Link>
    </div>
  );
}
