export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12">
      <div>
        <h1 className="text-4xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
          COOKIE POLICY
        </h1>
        <p className="text-[#B3B3B3]">Last updated: October 1, 2025</p>
      </div>

      <div className="panel-system p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">1. What Are Cookies</h2>
          <p className="text-[#B3B3B3] leading-relaxed">
            Cookies are small text files that are placed on your device when you visit our website. They are widely used to make websites work more efficiently, provide a better user experience, and provide information to the owners of the site. This Cookie Policy explains what cookies are, how we use them, and how you can control them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">2. How We Use Cookies</h2>
          <p className="text-[#B3B3B3] leading-relaxed mb-4">
            DHStx uses cookies and similar tracking technologies to enhance your experience on our platform. We use cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#B3B3B3] ml-4">
            <li>Essential functionality and security</li>
            <li>Remembering your preferences and settings</li>
            <li>Analyzing how you use our Service</li>
            <li>Improving our platform and user experience</li>
            <li>Authenticating users and preventing fraud</li>
            <li>Measuring the effectiveness of our communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">3. Types of Cookies We Use</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">3.1 Essential Cookies</h3>
              <p className="text-[#B3B3B3] leading-relaxed mb-3">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
              </p>
              <div className="bg-[#0C0C0C] rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#202020]">
                      <th className="text-left text-[#F2F2F2] py-2">Cookie Name</th>
                      <th className="text-left text-[#F2F2F2] py-2">Purpose</th>
                      <th className="text-left text-[#F2F2F2] py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#B3B3B3]">
                    <tr className="border-b border-[#202020]">
                      <td className="py-2">session_id</td>
                      <td className="py-2">User authentication</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b border-[#202020]">
                      <td className="py-2">csrf_token</td>
                      <td className="py-2">Security protection</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2">user_preferences</td>
                      <td className="py-2">Store user settings</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">3.2 Analytics Cookies</h3>
              <p className="text-[#B3B3B3] leading-relaxed mb-3">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our Service.
              </p>
              <div className="bg-[#0C0C0C] rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#202020]">
                      <th className="text-left text-[#F2F2F2] py-2">Cookie Name</th>
                      <th className="text-left text-[#F2F2F2] py-2">Purpose</th>
                      <th className="text-left text-[#F2F2F2] py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#B3B3B3]">
                    <tr className="border-b border-[#202020]">
                      <td className="py-2">_ga</td>
                      <td className="py-2">Google Analytics - visitor tracking</td>
                      <td className="py-2">2 years</td>
                    </tr>
                    <tr className="border-b border-[#202020]">
                      <td className="py-2">_gid</td>
                      <td className="py-2">Google Analytics - session tracking</td>
                      <td className="py-2">24 hours</td>
                    </tr>
                    <tr>
                      <td className="py-2">_gat</td>
                      <td className="py-2">Google Analytics - request throttling</td>
                      <td className="py-2">1 minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">3.3 Functional Cookies</h3>
              <p className="text-[#B3B3B3] leading-relaxed mb-3">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences and choices.
              </p>
              <div className="bg-[#0C0C0C] rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#202020]">
                      <th className="text-left text-[#F2F2F2] py-2">Cookie Name</th>
                      <th className="text-left text-[#F2F2F2] py-2">Purpose</th>
                      <th className="text-left text-[#F2F2F2] py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#B3B3B3]">
                    <tr className="border-b border-[#202020]">
                      <td className="py-2">theme_preference</td>
                      <td className="py-2">Remember theme settings</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b border-[#202020]">
                      <td className="py-2">language</td>
                      <td className="py-2">Remember language preference</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-2">dashboard_layout</td>
                      <td className="py-2">Remember dashboard customization</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">3.4 Performance Cookies</h3>
              <p className="text-[#B3B3B3] leading-relaxed mb-3">
                These cookies collect information about how you use our website, such as which pages you visit most often and if you receive error messages.
              </p>
              <div className="bg-[#0C0C0C] rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#202020]">
                      <th className="text-left text-[#F2F2F2] py-2">Cookie Name</th>
                      <th className="text-left text-[#F2F2F2] py-2">Purpose</th>
                      <th className="text-left text-[#F2F2F2] py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#B3B3B3]">
                    <tr className="border-b border-[#202020]">
                      <td className="py-2">performance_metrics</td>
                      <td className="py-2">Track page load times</td>
                      <td className="py-2">30 days</td>
                    </tr>
                    <tr>
                      <td className="py-2">error_tracking</td>
                      <td className="py-2">Log error occurrences</td>
                      <td className="py-2">7 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">4. Third-Party Cookies</h2>
          <p className="text-[#B3B3B3] leading-relaxed mb-4">
            We use services from third parties that may set cookies on your device. These include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#B3B3B3] ml-4">
            <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
            <li><strong>Stripe:</strong> For secure payment processing</li>
            <li><strong>Supabase:</strong> For authentication and database services</li>
            <li><strong>Vercel:</strong> For hosting and content delivery</li>
          </ul>
          <p className="text-[#B3B3B3] leading-relaxed mt-4">
            These third parties have their own privacy policies and cookie policies. We recommend reviewing their policies to understand how they use cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">5. How to Control Cookies</h2>
          <p className="text-[#B3B3B3] leading-relaxed mb-4">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences through the following methods:
          </p>
          
          <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 mt-4">5.1 Browser Settings</h3>
          <p className="text-[#B3B3B3] leading-relaxed mb-3">
            Most web browsers allow you to control cookies through their settings. You can set your browser to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#B3B3B3] ml-4">
            <li>Block all cookies</li>
            <li>Accept only first-party cookies</li>
            <li>Delete cookies when you close your browser</li>
            <li>Notify you when a cookie is set</li>
          </ul>
          <p className="text-[#B3B3B3] leading-relaxed mt-3">
            Please note that blocking all cookies may affect your ability to use certain features of our Service.
          </p>

          <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 mt-4">5.2 Browser-Specific Instructions</h3>
          <div className="bg-[#0C0C0C] rounded-lg p-4 space-y-2 text-[#B3B3B3]">
            <p><strong className="text-[#F2F2F2]">Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
            <p><strong className="text-[#F2F2F2]">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</p>
            <p><strong className="text-[#F2F2F2]">Safari:</strong> Preferences → Privacy → Cookies and website data</p>
            <p><strong className="text-[#F2F2F2]">Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</p>
          </div>

          <h3 className="text-xl font-bold text-[#F2F2F2] mb-3 mt-4">5.3 Opt-Out Tools</h3>
          <p className="text-[#B3B3B3] leading-relaxed mb-3">
            You can opt out of specific tracking services:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#B3B3B3] ml-4">
            <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#FFC96C] hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
            <li><strong>Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org/" className="text-[#FFC96C] hover:underline" target="_blank" rel="noopener noreferrer">NAI Opt-out Tool</a></li>
            <li><strong>Digital Advertising Alliance:</strong> <a href="https://optout.aboutads.info/" className="text-[#FFC96C] hover:underline" target="_blank" rel="noopener noreferrer">DAA Opt-out Tool</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">6. Do Not Track Signals</h2>
          <p className="text-[#B3B3B3] leading-relaxed">
            Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activities tracked. Currently, there is no industry standard for how to respond to DNT signals. We do not currently respond to DNT signals, but we respect your privacy choices and provide other methods to control tracking.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">7. Mobile Devices</h2>
          <p className="text-[#B3B3B3] leading-relaxed">
            Mobile devices have settings that allow you to control tracking and advertising. On iOS devices, you can use "Limit Ad Tracking" in your privacy settings. On Android devices, you can opt out of personalized ads in your Google settings. These settings may not block all cookies but will limit certain types of tracking.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">8. Updates to This Cookie Policy</h2>
          <p className="text-[#B3B3B3] leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F2F2F2] mb-4">9. Contact Us</h2>
          <p className="text-[#B3B3B3] leading-relaxed mb-4">
            If you have any questions about our use of cookies or this Cookie Policy, please contact us:
          </p>
          <div className="mt-4 p-4 bg-[#0C0C0C] rounded-lg">
            <p className="text-[#F2F2F2]">DHStx (Daley House Stacks)</p>
            <p className="text-[#B3B3B3]">Email: privacy@dhstx.com</p>
            <p className="text-[#B3B3B3]">Phone: (555) 123-4567</p>
          </div>
        </section>
      </div>
    </div>
  );
}
