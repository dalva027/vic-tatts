export interface BookingData {
  name: string;
  instagram: string;
  phone: string;
  style: string;
  placement: string;
  size: string;
  date: string;
  idea: string;
}

const API_BASE = "https://api.textbee.dev/api/v1";

/**
 * Send one SMS via the textbee.dev Android gateway.
 *
 * When credentials are not configured, the message is logged as a preview
 * instead of sent, so the whole flow can be exercised locally without a device.
 */
async function sendSMS(toPhone: string, message: string): Promise<void> {
  const deviceId = process.env.TEXTBEE_DEVICE_ID;
  const apiKey = process.env.TEXTBEE_API_KEY;

  if (!deviceId || !apiKey) {
    console.log(
      `[SMS Preview via textbee.dev] To: ${toPhone}\n${message}\n` +
        `(set TEXTBEE_DEVICE_ID and TEXTBEE_API_KEY in .env to actually send)`
    );
    return;
  }

  const response = await fetch(
    `${API_BASE}/gateway/devices/${deviceId}/send-sms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ recipients: [toPhone], message }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`textbee.dev SMS failed (${response.status}): ${body}`);
  }

  console.log(`SMS sent via textbee.dev to ${toPhone}`);
}

/** Format a preferred-date string for the owner, falling back gracefully. */
function formatPreferred(date: string): string {
  if (!date) return "no preference";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Text the shop owner the details of a new booking request so they can follow
 * up with the customer on Instagram / by phone.
 */
export async function sendOwnerBookingSMS(
  toPhone: string,
  booking: BookingData
): Promise<void> {
  const lines = [
    `New tattoo request — ${booking.name}`,
    booking.style ? `Style: ${booking.style}` : null,
    booking.placement ? `Placement: ${booking.placement}` : null,
    booking.size ? `Size: ${booking.size}` : null,
    `Preferred: ${formatPreferred(booking.date)}`,
    booking.instagram ? `IG: @${booking.instagram}` : null,
    `Phone: ${booking.phone}`,
    `Idea: ${booking.idea}`,
  ].filter((line): line is string => line !== null);

  await sendSMS(toPhone, lines.join("\n"));
}
