const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6 text-center">
            Privacy Policy
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose max-w-none">
              <p className="text-sm text-slate-600 mb-6">Last updated: March 16, 2024</p>

              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, submit a property, or contact us for support.</p>

              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>

              <h2>3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

              <h2>4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

              <h2>5. Contact Information</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at info@sunriseproperties.com.</p>

              <h2>6. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;