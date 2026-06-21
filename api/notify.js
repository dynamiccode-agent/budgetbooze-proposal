export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { action, proposalName, client, service, investment } = req.body
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Missing API key' })
  const isViewed = action === 'Proposal Viewed'
  const accentColor = '#f05522'
  const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Brisbane', dateStyle: 'full', timeStyle: 'short' })
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
        <tr>
          <td style="background:#0a0a0a;padding:24px 32px;text-align:left">
            <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">Dynamic Code</span>
            <span style="display:inline-block;margin-left:12px;background:${accentColor};color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px">${isViewed ? 'Proposal Viewed' : 'Proposal Signed'}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0a0a0a">${proposalName}</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#6b6b6b">${timestamp}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;border-radius:6px;padding:0;margin-bottom:24px">
              <tr><td style="padding:16px 20px;border-bottom:1px solid #e5e5e5"><span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#a3a3a3">Client</span><br><span style="font-size:14px;font-weight:600;color:#0a0a0a">${client}</span></td></tr>
              <tr><td style="padding:16px 20px;border-bottom:1px solid #e5e5e5"><span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#a3a3a3">Service</span><br><span style="font-size:14px;font-weight:600;color:#0a0a0a">${service}</span></td></tr>
              <tr><td style="padding:16px 20px"><span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#a3a3a3">Investment</span><br><span style="font-size:14px;font-weight:600;color:#0a0a0a">${investment}</span></td></tr>
            </table>
            <p style="margin:0;font-size:13px;color:#6b6b6b">${isViewed ? 'Someone has accessed and viewed this proposal.' : 'This proposal has been signed by the client.'}</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f5f5f5;padding:16px 32px;text-align:center;border-top:1px solid #e5e5e5">
            <span style="font-size:12px;color:#a3a3a3">Dynamic Code · Proposal Notifications · noreply@dynamiccode.app</span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Dynamic Code Proposals <noreply@dynamiccode.app>', to: ['tyler@dynamiccode.com.au'], subject: `${isViewed ? '👀' : '✅'} ${proposalName} — ${action}`, html })
  })
  const data = await response.json()
  return res.status(response.ok ? 200 : 500).json(data)
}
