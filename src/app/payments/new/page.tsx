import PageHeader from "@/components/PageHeader";
import ExpenseForm from "../_components/PaymentsForm";
import PaymentsForm from "../_components/PaymentsForm";

export const runtime = "edge";
function page() {
  return (
    <div>
      <PageHeader message="Payments page" />
      <PaymentsForm />
    </div>
  );
}

export default page;
