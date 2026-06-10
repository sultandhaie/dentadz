import ClinicShell from "../components/clinic-shell";

export default function OrdonnancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="ordonnances"
      title="Ordonnances"
      subtitle="Gérez toutes les ordonnances et prescriptions de votre cabinet."
      searchPlaceholder="Rechercher ordonnance, patient, médicament..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
