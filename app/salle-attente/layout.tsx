import ClinicShell from "../components/clinic-shell";

export default function SalleAttenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="salle-attente"
      title="Salle d’attente"
      subtitle="Gérez le flux des patients dans votre salle d’attente."
      searchPlaceholder="Rechercher patient, rendez-vous..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
