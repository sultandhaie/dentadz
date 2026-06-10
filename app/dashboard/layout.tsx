import ClinicShell from "../components/clinic-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="dashboard"
      title="Bonjour, Dr Benali 👋"
      subtitle="Voici l’activité de votre cabinet aujourd’hui."
      searchPlaceholder="Rechercher patient, rendez-vous..."
    >
      {children}
    </ClinicShell>
  );
}
