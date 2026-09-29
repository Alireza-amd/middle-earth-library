import { PageHeader } from "@/components/PageHeader";
import { PlanForm } from "@/features/plans/components/PlanForm";

export default function NewPlanPage() {
  return (
    <div className="container">
      <PageHeader title="New Plan" />
      <PlanForm />
    </div>
  );
}
