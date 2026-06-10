import ClinicShell from "../components/clinic-shell";

export default function TraitementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="traitements"
      title="Traitements"
      subtitle="Gérez les traitements et actes dentaires de votre cabinet."
      searchPlaceholder="Rechercher traitement, catégorie, prix..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
