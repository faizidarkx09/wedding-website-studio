import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { listOrders, listTemplates } from "@/lib/store";
import { AdminNav, RegisterOrderForm } from "../ui";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") redirect("/admin");
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-blue-100 text-blue-800",
  provisioned: "bg-violet-100 text-violet-800",
  delivered: "bg-green-100 text-green-800",
  refunded: "bg-stone-200 text-stone-700",
  cancelled: "bg-stone-200 text-stone-700",
  disputed: "bg-red-100 text-red-800",
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const [orders, templates] = await Promise.all([listOrders(), listTemplates()]);
  const templateName = (id: string) => templates.find((t) => t.id === id)?.name ?? id;

  return (
    <div className="min-h-screen bg-stone-100">
      <AdminNav current="/admin/orders" />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-stone-900">Orders</h1>
        <p className="mt-1 text-sm text-stone-600">
          {orders.length} {orders.length === 1 ? "order" : "orders"} · {orders.filter((o) => o.status === "pending").length} pending
        </p>

        <div className="mt-6">
          <RegisterOrderForm templates={templates} />
        </div>

        <section className="mt-6 overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <th scope="col" className="px-4 py-3">Etsy order</th>
                <th scope="col" className="px-4 py-3">Listing</th>
                <th scope="col" className="px-4 py-3">Customer</th>
                <th scope="col" className="px-4 py-3">Template</th>
                <th scope="col" className="px-4 py-3">Purchase date</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Delivery</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-stone-600">No orders yet — register one above.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-stone-900">{o.etsyOrderId}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-700">{o.etsyListingId}</td>
                    <td className="px-4 py-3">
                      <span className="block font-medium text-stone-900">{o.customerName}</span>
                      <span className="block text-xs text-stone-500">{o.customerEmail}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{templateName(o.templateId)}</td>
                    <td className="px-4 py-3 text-stone-700">{new Date(o.purchaseDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-700">{o.deliveryStatus}</td>
                    <td className="px-4 py-3">
                      <a href={`/admin/orders/${o.id}`} className="font-medium text-stone-800 underline">View →</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
