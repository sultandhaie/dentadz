import ClinicShell from "../components/clinic-shell";

export default function RapportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="rapports"
      title="Rapports"
      subtitle="Analysez l'activité, les revenus et les performances du cabinet."
      searchPlaceholder="Rechercher rapport, patient, praticien..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
