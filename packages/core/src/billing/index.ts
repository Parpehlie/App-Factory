import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';
import { config } from '../config';

/**
 * RevenueCat wrapper — the single source of truth for premium access.
 * IAP-native via RevenueCat is the ONLY payment path wired at launch (both stores).
 * No external / web checkout is implemented here (see region/ for the OFF-by-default stub).
 */

let initialized = false;

export interface EntitlementStatus {
  isActive: boolean;
  entitlementId: string;
  willRenew: boolean;
  expirationDate: string | null;
  productIdentifier: string | null;
  store: string | null;
}

export interface PurchaseResult {
  success: boolean;
  cancelled: boolean;
  entitlement: EntitlementStatus | null;
  error?: string;
}

export function isBillingInitialized(): boolean {
  return initialized;
}

/** Configure RevenueCat with the platform-specific publishable key. Idempotent. */
export async function initBilling(options?: { appUserId?: string; debug?: boolean }): Promise<void> {
  if (initialized) return;
  const apiKey = Platform.select({
    ios: config.revenueCat.iosApiKey,
    android: config.revenueCat.androidApiKey,
    default: '',
  });
  if (!apiKey) {
    console.warn('[core/billing] Missing RevenueCat API key for this platform; skipping init.');
    return;
  }
  if (options?.debug) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey, appUserID: options?.appUserId ?? null });
  initialized = true;
}

function mapEntitlement(info: CustomerInfo): EntitlementStatus {
  const id = config.revenueCat.entitlementId;
  const ent = info.entitlements.active[id];
  return {
    isActive: ent != null,
    entitlementId: id,
    willRenew: ent?.willRenew ?? false,
    expirationDate: ent?.expirationDate ?? null,
    productIdentifier: ent?.productIdentifier ?? null,
    store: ent?.store != null ? String(ent.store) : null,
  };
}

/** Current entitlement snapshot. */
export async function getEntitlement(): Promise<EntitlementStatus> {
  const info = await Purchases.getCustomerInfo();
  return mapEntitlement(info);
}

/** The current offering (RevenueCat Experiments auto-assigns A/B variants here). */
export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function getOfferingPackages(): Promise<PurchasesPackage[]> {
  const offering = await getCurrentOffering();
  return offering?.availablePackages ?? [];
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: true, cancelled: false, entitlement: mapEntitlement(customerInfo) };
  } catch (e: unknown) {
    const err = e as { userCancelled?: boolean; message?: string };
    if (err.userCancelled) {
      return { success: false, cancelled: true, entitlement: null };
    }
    return {
      success: false,
      cancelled: false,
      entitlement: null,
      error: err.message ?? 'Purchase failed',
    };
  }
}

export async function restorePurchases(): Promise<EntitlementStatus> {
  const info = await Purchases.restorePurchases();
  return mapEntitlement(info);
}

/** Subscribe to entitlement changes (renewals, restores, expirations). Returns an unsubscribe fn. */
export function addEntitlementListener(cb: (status: EntitlementStatus) => void): () => void {
  const listener = (info: CustomerInfo) => cb(mapEntitlement(info));
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => Purchases.removeCustomerInfoUpdateListener(listener);
}
