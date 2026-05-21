import { CalculatorApp } from "@/components/calculator/calculator-app";

/** TODO(calculator): Wire evaluator + history server actions. */
export default function CalculatorPage() {
  return (
    <main className="flex flex-1 flex-col p-6">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Calculator</h1>
      <CalculatorApp />
    </main>
  );
}
