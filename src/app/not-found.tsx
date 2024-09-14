import Link from "next/link";

export const runtime = "edge";
export default function NotFound() {
  // Set initial time (in seconds)

  return (
    <div>
      <h1 className="text-center text-5xl font-bold">
        Your requested page is not found
      </h1>
      <Link href="/" className="text-blue-600 underline underline-offset-2">
        here
      </Link>
      .
    </div>
  );
}
