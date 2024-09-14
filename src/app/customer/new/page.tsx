import PageHeader from "@/components/PageHeader";
import CustomerForm from "../_components/CustomerForm";
export const runtime = "edge";
export default function CreateCustomer() {
  return (
    <>
      <div className="sm:mx-24">
        <PageHeader message="New Customer Page" />

        <CustomerForm />
      </div>
    </>
  );
}
