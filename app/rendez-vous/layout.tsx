import ClinicShell from "../components/clinic-shell";

export default function RendezVousLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="rendez-vous"
      title="Rendez-vous"
      subtitle="Planifiez, confirmez et suivez les rendez-vous du cabinet."
      searchPlaceholder="Rechercher patient, rendez-vous..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
