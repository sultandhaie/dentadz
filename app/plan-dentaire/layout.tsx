import ClinicShell from "../components/clinic-shell";

export default function PlanDentaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="plan-dentaire"
      title="Plan dentaire"
      subtitle="Créez et gérez les plans de traitement personnalisés de vos patients."
      searchPlaceholder="Rechercher patient, plan, traitement..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
