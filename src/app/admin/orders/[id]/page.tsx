import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getOrderById, getSiteById, getTemplateById } from "@/lib/store";
import { AdminNav, OrderActions } from "../../ui";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") redirect("/admin");
}

const TIMELINE: OrderStatus[] = ["pending", "verified", "provisioned", "delivered"];
const TIMELINE_LABELS: Record<string, string> = {
  pending: "Pending",
  verified: "Verified",
  provisioned: "Provisioned",
  delivered: "Delivered",
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const [template, site] = await Promise.all([
    getTemplateById(order.templateId),
    order.siteId ? getSiteById(order.siteId) : Promise.resolve(null),
  ]);

  const isFlagged = order.status === "refunded" || order.status === "cancelled" || order.status === "disputed";
  const currentStep = TIMELINE.indexOf(order.status);

  return (
    <div className="min-h-screen bg-stone-100">
      <AdminNav current="/admin/orders" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <a href="/admin/orders" className="text-sm font-medium text-stone-700 underline">← Back to orders</a>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">Order {order.etsyOrderId}</h1>
        <p className="mt-1 text-sm text-stone-600">
          Registered {new Date(order.purchaseDate).toLocaleString()} · Delivery: {order.deliveryStatus}
        </p>

        {isFlagged ? (
          <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            This order is flagged as {order.status}.
          </p>
        ) : null}

        {/* Status timeline */}
        <ol className="mt-6 flex flex-wrap items-center gap-2" aria-label="Order status">
          {TIMELINE.map((step, i) => {
            const done = i < currentStep || order.status === step;
            const isCurrent = i === currentStep;
            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isCurrent ? "bg-stone-900 text-white" : done ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {i + 1}. {TIMELINE_LABELS[step]}
                </span>
                {i < TIMELINE.length - 1 ? <span className="text-stone-400" aria-hidden="true">→</span> : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="text-base font-semibold text-stone-900">Order details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Etsy order ID</dt><dd className="font-mono text-stone-900">{order.etsyOrderId}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Etsy listing ID</dt><dd className="font-mono text-stone-900">{order.etsyListingId}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Customer</dt><dd className="text-stone-900">{order.customerName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Customer email</dt><dd className="text-stone-900">{order.customerEmail}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Template</dt><dd className="text-stone-900">{template?.name ?? order.templateId} (${template?.priceUsd ?? "?"})</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Status</dt><dd className="font-medium text-stone-900">{order.status}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Delivery status</dt><dd className="text-stone-900">{order.deliveryStatus}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-500">Access code</dt><dd className="text-stone-900">{order.accessCodeId ? "Issued (hash stored only)" : "Not issued yet"}</dd></div>
            </dl>
            {site ? (
              <p className="mt-4 text-sm">
                Site:{" "}
                <a href={`/w/${site.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium text-stone-800 underline">
                  /w/{site.slug}
                </a>{" "}
                <span className="text-stone-500">({site.status})</span>
              </p>
            ) : (
              <p className="mt-4 text-sm text-stone-600">No site yet — provision the order to create one.</p>
            )}
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <h2 className="text-base font-semibold text-stone-900">Actions</h2>
            <div className="mt-3">
              <OrderActions order={order} siteSlug={site?.slug ?? null} />
            </div>
            <p className="mt-4 text-xs text-stone-500">
              Access codes are stored as hashes only. A code is displayed exactly once — when it is first provisioned
              or reset. If it is lost, reset it to issue a new one.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
