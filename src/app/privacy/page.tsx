import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SaaSToolz collects, uses and protects your data.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | SaaSToolz", description: "How SaaSToolz collects, uses and protects your data." },
};

const LAST_UPDATED = "September 15, 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. What we collect</h2>
          <p>
            Free tools that run entirely in your browser (most PDF, image, text and
            developer tools) never send your file or text content to our servers —
            it never leaves your device. Where a tool does require server
            processing, uploaded files are processed in memory and deleted within
            1 hour; we don&apos;t retain a copy.
          </p>
          <p className="mt-2">
            If you create an account, we store your name, email address, and — if
            you sign in with Google — the profile information Google shares with
            us under its OAuth consent flow. If you subscribe to a paid plan, Stripe
            processes your payment details directly; we never see or store your
            card number.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How we use it</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate your account, enforce plan/usage limits, and track AI credit balances.</li>
            <li>To process billing through Stripe and keep your subscription status in sync.</li>
            <li>To measure aggregate, anonymized tool usage so we know what to improve.</li>
            <li>To respond if you contact support.</li>
          </ul>
          <p className="mt-2">We do not sell your personal data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Third parties</h2>
          <p>
            We use Stripe for billing, Google for optional sign-in, third-party
            advertising vendors (including Google AdSense) to show ads that help
            keep our tools free, and — for Pro/Enterprise AI tools — third-party
            AI providers (e.g. OpenAI, ElevenLabs) to process the specific
            request you submit to that tool. Each is bound by its own privacy
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Advertising</h2>
          <p>
            SaaSToolz displays ads served by Google and other third-party ad
            vendors and networks to help keep our tools free to use. These
            vendors, including Google, use cookies to serve ads based on your
            prior visits to this and other websites. Google&apos;s use of
            advertising cookies enables it and its partners to serve ads to you
            based on your visits to this site and/or other sites on the
            Internet.
          </p>
          <p className="mt-2">
            You can opt out of personalized advertising by visiting{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
              Google Ads Settings
            </a>. You can also opt out of a participating third-party
            vendor&apos;s use of cookies for personalized advertising by
            visiting{" "}
            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
              www.aboutads.info
            </a>.
          </p>
          <p className="mt-2">
            Our ad vendors and networks may collect information through
            cookies, web beacons, IP addresses, and device identifiers about
            your visits to this and other websites in order to serve ads about
            goods and services that may interest you. For more information
            about how Google collects and uses this data, see{" "}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
              How Google uses information from sites or apps that use our
              services
            </a>.
          </p>
          <p className="mt-2">
            If you are located in the European Economic Area, the United
            Kingdom, or Switzerland, you will be shown a consent message when
            you first visit this site that lets you choose whether to allow
            personalized advertising and third-party advertising cookies. You
            can change your choice at any time from that message.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Your rights</h2>
          <p>
            You can request a copy of your data or ask us to delete your account
            and associated data at any time by contacting us — see the{" "}
            <a href="/contact" className="text-violet-600 hover:underline">Contact</a> page.
            If you&apos;re in the EU/UK, this includes rights under GDPR (access,
            correction, deletion, portability, objection).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Cookies</h2>
          <p>
            We use a session cookie to keep you signed in, a first-party
            visitor cookie to measure anonymized tool usage, and, if you use a
            paid plan, a Stripe cookie during checkout. Third-party ad vendors,
            including Google, also set advertising cookies on this site — see
            the Advertising section above for details and opt-out options.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Contact</h2>
          <p>
            Questions about this policy? Reach us at{" "}
            <a href="mailto:privacy@saastoolz.com" className="text-violet-600 hover:underline">
              privacy@saastoolz.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
