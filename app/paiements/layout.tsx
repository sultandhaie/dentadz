import ClinicShell from "../components/clinic-shell";

export default function PaiementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClinicShell
      activeRoute="paiements"
      title="Paiements"
      subtitle="Gérez les paiements, factures et soldes patients de votre cabinet."
      searchPlaceholder="Rechercher patient, facture, paiement..."
      maxWidth="max-w-[1640px]"
    >
      {children}
    </ClinicShell>
  );
}
