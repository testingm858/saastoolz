import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact SaaSToolz — Support & Feedback",
  description: "Get in touch with the SaaSToolz team for support, bug reports, feature ideas or partnership questions using our contact form.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | SaaSToolz", description: "Get in touch with the SaaSToolz team for support, bug reports, feature ideas or partnership questions using our contact form.", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact us</h1>
      <p className="text-gray-500 mb-10">
        Bug report, billing question, tool request — send us a message and we&apos;ll get back to you.
      </p>

      <ContactForm />
    </div>
  );
}
