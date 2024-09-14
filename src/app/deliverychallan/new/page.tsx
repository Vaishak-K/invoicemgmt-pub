import PageHeader from "@/components/PageHeader";
import DeliveryChallanForm from "../_components/DeliveryChallanForm";
// import ExpenseForm from "../_components/PaymentsForm";
// import PaymentsForm from "../_components/PaymentsForm";
export const runtime = "edge";

function page() {
  return (
    <div>
      <DeliveryChallanForm />
    </div>
  );
}

export default page;
