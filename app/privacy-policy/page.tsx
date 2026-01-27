import PageSection from "@/components/_core/layout/PageSection";

export default function PrivacyPolicyPage() {
  return (
    <PageSection title="Privacy Policy" className="min-h-screen">
      <div className="max-w-4xl mx-auto prose prose-invert">
        <p className="text-gray-400 text-sm mb-8">Last Updated: January 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono">
            Welcome to TALOS 5.0. We are committed to protecting the privacy of the students registering for our event. This Privacy Policy outlines how we collect, use, and safeguard your information when you register for our event hosted at Chennai Institute of Technology, Tamil Nadu.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">2. Information We Collect</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono mb-4">
            To facilitate event registration and verification, we collect the following personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 font-ibm-plex-mono ml-4">
            <li><strong>Personal Details:</strong> Full Name, Email Address, and Phone Number.</li>
            <li><strong>Student Verification:</strong> We may collect details such as your College Name or Roll Number to verify your eligibility as a student.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">3. Payment Information</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono">
            We use Razorpay as our secure payment gateway. We do not store your credit/debit card numbers, UPI IDs, or banking passwords on our servers. All financial transactions are processed securely through Razorpay's encrypted infrastructure. Please refer to Razorpay's Privacy Policy for more details on how they handle your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">4. How We Use Your Information</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono mb-4">
            We use the collected data for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 font-ibm-plex-mono ml-4">
            <li>To process your registration and generate your event ticket/pass.</li>
            <li>To send confirmation emails, event updates, and schedules.</li>
            <li>To verify your identity at the event venue.</li>
            <li>To contact you regarding any changes to the event timings or venue.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">5. Data Sharing</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono">
            We do not sell, trade, or rent your personal information to third parties. Your data is strictly used for the organization and management of this specific event.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4 font-zen-dots">6. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed font-ibm-plex-mono mb-4">
            If you have any questions regarding this privacy policy, please contact the organizing committee:
          </p>
          <div className="bg-muted/20 p-4 rounded-lg border border-white/5 space-y-2">
            <p className="text-gray-300 font-ibm-plex-mono">
              <strong className="text-red-500">Email:</strong> taloscit72@gmail.com
            </p>
            <p className="text-gray-300 font-ibm-plex-mono">
              <strong className="text-red-500">Phone:</strong> +91 7305401558
            </p>
            <p className="text-gray-300 font-ibm-plex-mono">
              <strong className="text-red-500">Address:</strong> Department of Artificial Intelligence and Data Science, Chennai Institute of Technology, Sarathy Nagar, Kundrathur, Chennai-600100
            </p>
          </div>
        </section>
      </div>
    </PageSection>
  );
}
