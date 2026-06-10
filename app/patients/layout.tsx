import ClinicShell from "../components/clinic-shell";

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="patients"
      title="Patients"
      subtitle="Gérez les dossiers et le suivi de vos patients."
      searchPlaceholder="Rechercher patient, téléphone, dossier..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
