import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import {
  audit,
  getOrderById,
  getTemplateById,
  listOrders,
  provisionOrder,
  resetAccessCode,
  revokeAccessCode,
  saveOrder,
} from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  return session && session.role === "admin" ? session : null;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const FLAG_STATUSES: OrderStatus[] = ["refunded", "cancelled", "disputed"];

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Invalid request body.");
  }

  const action = body.action;
  if (typeof action !== "string") return bad("Missing action.");

  // --- create: register an Etsy order manually. The admin-chosen templateId
  // is authoritative; the listing ID never overrides it on save. ---
  if (action === "create") {
    const etsyOrderId = typeof body.etsyOrderId === "string" ? body.etsyOrderId.trim() : "";
    const etsyListingId = typeof body.etsyListingId === "string" ? body.etsyListingId.trim() : "";
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
    const templateId = typeof body.templateId === "string" ? body.templateId.trim() : "";
    if (!etsyOrderId || !etsyListingId || !customerName || !customerEmail || !templateId) {
      return bad("Etsy order ID, listing ID, customer name, customer email and template are all required.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return bad("Customer email does not look valid.");
    }
    const template = await getTemplateById(templateId);
    if (!template) return bad("Selected template does not exist.");
    const existing = (await listOrders()).find((o) => o.etsyOrderId === etsyOrderId);
    if (existing) return bad(`An order with Etsy order ID ${etsyOrderId} is already registered.`, 409);

    const order = {
      id: `order-${randomUUID()}`,
      etsyOrderId,
      etsyListingId,
      customerName,
      customerEmail,
      templateId: template.id,
      purchaseDate: new Date().toISOString(),
      status: "pending" as OrderStatus,
      siteId: null,
      accessCodeId: null,
      deliveryStatus: "not-started" as const,
      displayCode: null,
    };
    await saveOrder(order);
    audit("admin", "order.create", `Order ${etsyOrderId} registered for ${customerName} (${template.name}).`);
    return NextResponse.json({ ok: true, id: order.id });
  }

  // --- All remaining actions target an existing order. ---
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return bad("Missing order id.");
  const order = await getOrderById(id);
  if (!order) return bad("Order not found.", 404);

  if (action === "verify") {
    if (order.status !== "pending") return bad(`Only a pending order can be verified (current: ${order.status}).`);
    order.status = "verified";
    await saveOrder(order);
    audit("admin", "order.verify", `Order ${order.etsyOrderId} verified.`);
    return NextResponse.json({ ok: true, status: order.status });
  }

  if (action === "provision") {
    try {
      // provisionOrder is idempotent: already=true returns the existing
      // site with an EMPTY code — the original code is never shown again.
      const { site, code, already } = await provisionOrder(order.id);
      return NextResponse.json({ ok: true, siteSlug: site.slug, code: already ? "" : code, already });
    } catch (err) {
      return bad(err instanceof Error ? err.message : "Provisioning failed.");
    }
  }

  if (action === "deliver") {
    if (order.status !== "provisioned") return bad(`Only a provisioned order can be delivered (current: ${order.status}).`);
    order.status = "delivered";
    order.deliveryStatus = "delivered";
    await saveOrder(order);
    audit("admin", "order.deliver", `Order ${order.etsyOrderId} marked delivered.`);
    return NextResponse.json({ ok: true, status: order.status });
  }

  if (action === "reset-code") {
    if (!order.accessCodeId) return bad("This order has no access code to reset.");
    try {
      const code = await resetAccessCode(order.id);
      // New code returned exactly once, in this response only.
      return NextResponse.json({ ok: true, code });
    } catch (err) {
      return bad(err instanceof Error ? err.message : "Could not reset the access code.");
    }
  }

  if (action === "revoke-code") {
    if (!order.accessCodeId) return bad("This order has no access code to revoke.");
    await revokeAccessCode(order.accessCodeId);
    return NextResponse.json({ ok: true });
  }

  if (action === "flag") {
    const status = body.status;
    if (typeof status !== "string" || !FLAG_STATUSES.includes(status as OrderStatus)) {
      return bad("Flag status must be refunded, cancelled or disputed.");
    }
    order.status = status as OrderStatus;
    await saveOrder(order);
    audit("admin", "order.flag", `Order ${order.etsyOrderId} flagged as ${status}.`);
    return NextResponse.json({ ok: true, status: order.status });
  }

  return bad(`Unknown action: ${action}.`);
}
