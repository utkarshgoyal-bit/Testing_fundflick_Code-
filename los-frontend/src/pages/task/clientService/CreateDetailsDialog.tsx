import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IClientTable } from '@/lib/interfaces';
function ClientDetailsDialog({ client, onOpenChange }: { client: IClientTable | null; onOpenChange: () => void }) {
  if (!client) return null;

  return (
    <Dialog open={!!client} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-color-surface text-fg-primary border-fg-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-fg-primary">{client.name}</DialogTitle>
          <DialogDescription className="text-fg-secondary">
            {client.clientType} | Created on {new Date(client.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm max-h-[70vh] overflow-y-auto p-1 pr-4">
          {/* Contact Info */}
          <DetailSection title="Contact Information">
            <DetailItem label="Email" value={client.email} />
            <DetailItem label="Mobile" value={client.mobile} />
            <DetailItem label="Address" value={client.address} />
          </DetailSection>

          {/* Contact Person */}
          {client.contactPerson && (
            <DetailSection title="Contact Person">
              <DetailItem label="Name" value={client.contactPerson.name} />
              <DetailItem label="Mobile" value={client.contactPerson.mobile} />
              <DetailItem label="Email" value={client.contactPerson.email} />
            </DetailSection>
          )}

          {/* Business Details */}
          {client.clientType === 'business' && (
            <DetailSection title="Business Details">
              <DetailItem label="Organization" value={client.organizationName} />
              <DetailItem label="Type" value={client.organizationType} />
              <DetailItem label="PAN" value={client.pan} />
              <DetailItem label="GST" value={client.gst} />
              <DetailItem label="TAN" value={client.tan} />
              <DetailItem label="CIN" value={client.cin} />
            </DetailSection>
          )}

          {/* Directors */}
          {client.directors && client.directors.length > 0 && (
            <DetailSection title="Directors">
              <ul className="space-y-2">
                {client.directors.map((d) => (
                  <li key={d._id} className="text-fg-secondary">
                    <strong className="text-fg-primary">{d.name}</strong> (DIN: {d.din}, Aadhaar: {d.aadhaar})
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {/* Services */}
          {client.services && client.services.length > 0 && (
            <DetailSection title="Subscribed Services">
              <div className="space-y-3">
                {client.services.map((s) => (
                  <div key={s._id} className="border border-fg-border rounded-lg p-3 bg-color-surface-muted">
                    <p className="font-semibold text-fg-primary">{s.serviceName}</p>
                    <p className="text-xs text-fg-secondary mb-2">{s.departmentId}</p>
                    {s.subCategories.length > 0 && (
                      <ul className="list-disc list-inside ml-4 text-fg-secondary">
                        {s.subCategories.map((sub) => (
                          <li key={sub._id}>{sub.returnName}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Bank Details */}
          <DetailSection title="Bank Details">
            <DetailItem label="Bank" value={client.bankName} />
            <DetailItem label="Account No" value={client.accountNumber} />
            <DetailItem label="IFSC" value={client.ifsc} />
            <DetailItem label="Branch" value={client.branch} />
          </DetailSection>

          {/* Portal Details */}
          {(client.portalName || client.portalId) && (
            <DetailSection title="Portal Access">
              <DetailItem label="Portal Name" value={client.portalName} />
              <DetailItem label="Portal ID" value={client.portalId} />
              <DetailItem label="Password" value={client.portalPassword} />
            </DetailSection>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3 className="font-semibold text-fg-primary border-b border-fg-border pb-2 mb-3 text-base">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">{children}</div>
  </section>
);

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <p className="text-fg-secondary">
    <strong className="text-fg-primary font-medium">{label}:</strong> {value || '-'}
  </p>
);
export default ClientDetailsDialog;
