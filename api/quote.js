// Vercel Serverless Function — receives the /quote form POST and forwards it
// to JotForm (form 261547427868067) server-side, so the API key is never
// exposed in the browser. Field/QID map:
//   QID 2  Full Name           -> submission[2_first] / submission[2_last]
//   QID 3  Phone Number        -> submission[3_full]
//   QID 12 Marketing SMS       -> submission[12]  ("Yes" / "No")
//   QID 13 Transactional SMS   -> submission[13]  ("Yes" / "No")

const JOTFORM_FORM_ID = '261547427868067';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.JOTFORM_API_KEY;
  if (!apiKey) {
    console.error('JOTFORM_API_KEY is not set');
    return res.status(500).json({ error: 'Server not configured' });
  }

  // Vercel auto-parses JSON bodies; fall back to manual parse just in case.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  // Single site field -> JotForm's split first/last. Split on the first space:
  // first word -> first name, the rest -> last name. No space -> all first.
  const spaceIdx = name.indexOf(' ');
  const firstName = spaceIdx === -1 ? name : name.slice(0, spaceIdx);
  const lastName = spaceIdx === -1 ? '' : name.slice(spaceIdx + 1).trim();

  const marketing = body.sms_marketing_consent === 'yes' ? 'Yes' : 'No';
  const transactional = body.sms_transactional_consent === 'yes' ? 'Yes' : 'No';

  const payload = new URLSearchParams();
  payload.append('submission[2_first]', firstName);
  payload.append('submission[2_last]', lastName);
  payload.append('submission[3_full]', phone);
  payload.append('submission[12]', marketing);
  payload.append('submission[13]', transactional);

  try {
    const jfRes = await fetch(
      `https://api.jotform.com/form/${JOTFORM_FORM_ID}/submissions?apiKey=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      }
    );

    const data = await jfRes.json().catch(() => ({}));

    if (!jfRes.ok || data.responseCode >= 400) {
      console.error('JotForm submission failed', jfRes.status, data);
      return res.status(502).json({ error: 'Submission failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error forwarding to JotForm', err);
    return res.status(502).json({ error: 'Submission failed' });
  }
};
