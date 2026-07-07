export const COURIERS = [
  'Delhivery',
  'Blue Dart',
  'DTDC',
  'India Post',
  'Ecom Express',
  'Xpressbees',
  'Other',
] as const;

const TRACK_URL: Record<string, (awb: string) => string> = {
  'Delhivery': awb => `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`,
  'Blue Dart': awb => `https://www.bluedart.com/web/guest/trackdartresultthirdparty?trackFor=0&trackNo=${encodeURIComponent(awb)}`,
  'DTDC': awb => `https://www.dtdc.in/tracking/tracking_results.asp?strCnno=${encodeURIComponent(awb)}`,
  'India Post': () => `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`,
  'Ecom Express': awb => `https://ecomexpress.in/tracking/?awb_field=${encodeURIComponent(awb)}`,
  'Xpressbees': awb => `https://www.xpressbees.com/track?awbNo=${encodeURIComponent(awb)}`,
};

export function courierTrackingUrl(courier: string | undefined, trackingNumber: string | undefined): string | null {
  if (!courier || !trackingNumber) return null;
  const fn = TRACK_URL[courier];
  return fn ? fn(trackingNumber) : null;
}
