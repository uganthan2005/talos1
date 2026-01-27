import PageSection from "@/components/_core/layout/PageSection";

export default function RefundPolicyPage() {
  return (
    <PageSection title="Refund and Cancellation Policy" className="min-h-screen">
      <div className="max-w-4xl mx-auto prose prose-invert">
        <p className="text-gray-400 text-sm mb-8">Last Updated: January 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">1. General Policy</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono">
            By registering for TALOS 5.0, you acknowledge and agree to the terms outlined below. As this is a student-organized event with limited seating and fixed arrangements, all sales are final.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">2. No Refunds</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono mb-4">
            Once a registration is completed and the payment is processed, no refunds will be issued under any circumstances. This applies to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 font-ibm-plex-mono ml-4">
            <li>Change of plans or personal unavailability.</li>
            <li>Medical emergencies.</li>
            <li>Mistaken double bookings (unless verified by our technical team).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">3. No Cancellations</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono">
            We do not accept cancellation requests once the ticket has been purchased. Please review your details and availability carefully before proceeding with the payment.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">4. Non-Transferability</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono">
            Registrations are non-transferable. The ticket is valid only for the student whose name and details were provided at the time of registration. You must present a valid college ID card matching the registration details to enter the venue.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">5. Event Cancellation by Organizer</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono">
            In the rare event that the entire event is cancelled by the organizers due to unavoidable circumstances (e.g., force majeure, administrative orders), we will notify all registered participants via email regarding the further course of action.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">6. Support</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono mb-4">
            If you face any technical issues during the payment process (e.g., amount deducted but ticket not received), please contact us immediately with your transaction ID.
          </p>
          <div className="bg-muted/20 p-4 rounded-lg border border-white/5">
            <p className="text-gray-300 font-ibm-plex-mono">
              <strong className="text-red-500">Email:</strong> taloscit72@gmail.com
            </p>
            <p className="text-gray-300 font-ibm-plex-mono mt-2">
              <strong className="text-red-500">Subject Line:</strong> Payment Issue - Muzammil - +91 7305401558
            </p>
          </div>
        </section>
      </div>
    </PageSection>
  );
}
