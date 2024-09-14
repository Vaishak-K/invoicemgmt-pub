import { Dashboard } from "@/components/Dashboard/Dashboard";
export const runtime = "edge";
export default async function Home() {
  return (
    <>
      <div className="pt-6">
        <div className="bg-teal-600 text-white p-6">
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            Dashboard
          </h1>
        </div>
      </div>

      <Dashboard />
    </>
  );
}
