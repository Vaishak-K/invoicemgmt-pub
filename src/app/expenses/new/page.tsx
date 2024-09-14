import PageHeader from "@/components/PageHeader";
import ExpenseForm from "../_components/ExpenseForm";

export const runtime = "edge";

function page() {
  return (
    <div>
      <PageHeader message="New Expenses page" />
      <ExpenseForm />
    </div>
  );
}

export default page;
