import ClinicShell from "../components/clinic-shell";

export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="parametres"
      title="Paramètres"
      subtitle="Gérez les paramètres et préférences de votre cabinet."
      searchPlaceholder="Rechercher paramètre, utilisateur, préférence..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
