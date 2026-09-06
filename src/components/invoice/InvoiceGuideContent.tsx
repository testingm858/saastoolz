// Long-form supporting content for the Invoice Generator tool page — what an
// invoice is, how to build one correctly, and the surrounding practical and
// legal context (tax invoices, numbering, recordkeeping). Rendered only on
// /tools/invoice-generator (see src/app/tools/[toolId]/page.tsx) — this is
// deliberately a single hand-authored page, not a pattern applied to every
// tool, so the content stays genuinely deep rather than templated filler.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function InvoiceGuideContent() {
  return (
    <div className="mt-16 border-t border-gray-100 pt-10 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Everything you need to know about invoices</h2>

      <Section title="What is an invoice?">
        <p>
          An invoice is a commercial document a seller sends to a buyer requesting payment for goods or services that
          have <em>already</em> been delivered. It sits between two other documents people often confuse it with: a
          quote (sent <em>before</em> work starts, an estimate with no payment due yet) and a receipt (sent{" "}
          <em>after</em> payment, confirming money already changed hands). An invoice is the middle step — the work
          is done, and payment is now formally due.
        </p>
        <p>
          Beyond just asking for money, an invoice creates a paper trail: it&apos;s the primary record most tax
          authorities expect a business to keep for reporting revenue, and it&apos;s the document a customer needs
          for their own bookkeeping and, if applicable, to reclaim tax.
        </p>
      </Section>

      <Section title="How to create an invoice">
        <p>At minimum, a usable invoice needs six things — everything the form above is built around:</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li><strong>Issuer identity</strong> — your business name, address, and contact details.</li>
          <li><strong>Customer identity</strong> — who is being billed.</li>
          <li><strong>An invoice number and date</strong> — for both your records and theirs.</li>
          <li><strong>A description of what&apos;s being billed</strong> — one line item per product or service, with quantity and price.</li>
          <li><strong>The amount due and payment terms</strong> — the total, the currency, and when it&apos;s due.</li>
          <li><strong>Tax details, if applicable</strong> — your tax/VAT number and the rate charged, shown separately from the subtotal.</li>
        </ol>
        <p>
          Fill those into the form above and the live preview builds the document as you go — there&apos;s no
          separate &quot;generate&quot; step hiding what you&apos;ll get.
        </p>
      </Section>

      <Section title="Invoice examples">
        <p>The right invoice shape depends on what you&apos;re actually billing for:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Freelance/service invoice</strong> — usually one or two line items (e.g. &quot;Website design —
            20 hours × $75&quot;), no inventory, often due on receipt or within 14–30 days.
          </li>
          <li>
            <strong>Product/goods invoice</strong> — multiple line items with quantities and unit prices, sometimes a
            separate shipping line, and tax calculated per line if rates differ by item.
          </li>
          <li>
            <strong>Recurring/subscription invoice</strong> — a fixed amount billed on a regular schedule; note the
            billing period it covers (e.g. &quot;Service period: March 2026&quot;) so the customer knows exactly what
            they&apos;re paying for.
          </li>
        </ul>
      </Section>

      <Section title="Invoice vs. receipt — what's the difference?">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="py-2 pr-4"></th>
                <th className="py-2 pr-4">Invoice</th>
                <th className="py-2">Receipt</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="py-2 pr-4 font-medium text-gray-700">When it&apos;s issued</td>
                <td className="py-2 pr-4">Before payment</td>
                <td className="py-2">After payment</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2 pr-4 font-medium text-gray-700">Purpose</td>
                <td className="py-2 pr-4">Requests payment</td>
                <td className="py-2">Confirms payment received</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-700">Who typically needs it</td>
                <td className="py-2 pr-4">Seller, to get paid and for revenue records</td>
                <td className="py-2">Buyer, as proof of purchase</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="What is a tax invoice?">
        <p>
          A tax invoice is a regular invoice with a few extra required fields — your business&apos;s tax/VAT/GST
          registration number, and the tax rate and amount shown as a separate line rather than folded into the
          total. It&apos;s the version tax authorities and VAT/GST-registered customers need in order to report or
          reclaim tax on the transaction.
        </p>
        <p>
          Exact requirements vary significantly by country — VAT invoices in the EU and UK, GST invoices in India,
          Australia and Canada, and sales tax receipts in the US all have different rules — so check your local tax
          authority&apos;s requirements for your specific situation. This tool supports the common case: fill in your{" "}
          <strong>Tax/VAT Number</strong> in the company section and set a <strong>tax percentage per line item</strong>,
          and both appear correctly broken out on the generated invoice.
        </p>
      </Section>

      <Section title="Invoice numbering — why it matters">
        <p>
          Every invoice should have a unique, sequential number — never reused, and ideally never skipped. This
          isn&apos;t just tidiness: gaps or duplicates in an invoice sequence are one of the first things an auditor
          or tax authority looks for, since they can indicate unreported income or bookkeeping errors.
        </p>
        <p>
          Common formats include a simple incrementing number (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">INV-0001</code>,{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">INV-0002</code>...), a year-prefixed sequence (
          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">2026-001</code>), or a client-prefixed one for
          agencies billing many clients. This tool generates a number automatically, but the field is fully
          editable — overwrite it to match whatever sequence your business already uses.
        </p>
      </Section>

      <Section title="How businesses should maintain invoices">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Keep them for as long as your tax authority requires</strong> — commonly 5–7 years, but this varies by country and entity type.</li>
          <li><strong>Back them up somewhere durable</strong> — cloud storage or accounting software, not just a laptop&apos;s downloads folder.</li>
          <li><strong>Track paid vs. unpaid separately</strong> — a simple status (Draft, Pending, Paid, Overdue) prevents chasing invoices that were already settled, or forgetting ones that weren&apos;t.</li>
          <li><strong>Reconcile against bank statements regularly</strong> — matching invoices to actual deposits catches missed or short payments early.</li>
          <li><strong>Never edit and resend an invoice with the same number</strong> — if something needs correcting after it&apos;s sent, issue a new invoice (or a credit note) referencing the original instead.</li>
        </ul>
      </Section>

      <Section title="Invoice templates">
        <p>
          A good invoice template needs to do a few things well: identify the business clearly (logo, name, contact
          details), itemize what&apos;s being charged without ambiguity, total everything correctly including any
          discounts and tax, and state payment terms plainly. Beyond that, style is mostly a matter of taste — a
          template that&apos;s easy for a customer to scan and understand in ten seconds is doing its job.
        </p>
        <p>
          This tool provides one clean, professional template — company branding, itemized line items with
          per-line discount and tax, multi-currency totals, and an optional signature — covering the common case for
          freelancers, agencies and small businesses without needing to pick from a gallery first.
        </p>
      </Section>
    </div>
  );
}
