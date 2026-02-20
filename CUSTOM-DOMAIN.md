# Custom domain: files.lexicon-legal.ai → Railway

Use this to serve your app at **https://files.lexicon-legal.ai** (GoDaddy + Railway).

---

## 1. Add the custom domain in Railway (do this first)

1. Open [Railway Dashboard](https://railway.app/dashboard) and select your project.
2. Click the **lexicon-server** (or your app) service.
3. Go to **Settings** → **Networking** → **Public Networking**.
4. In **Custom Domains**, type: **`files.lexicon-legal.ai`**
5. Click **+ Custom Domain** (or **Add domain**).
6. Railway will show a **CNAME target**, e.g. **`lexicon-server-abc123.up.railway.app`** (or a short form like `xxxxx.up.railway.app`).
7. **Copy that exact value** — you’ll use it in GoDaddy in step 2.

The domain will show as unverified (yellow/orange) until DNS is set and propagated. SSL will be “Validating” until DNS is correct.

---

## 2. Add a CNAME record in GoDaddy

1. Sign in at [GoDaddy](https://www.godaddy.com) → **My Products**.
2. Find **lexicon-legal.ai** → click **DNS** (or **Manage DNS**).
3. In **DNS Records**, click **Add** (or **Add New Record**).
4. Choose **CNAME**.
5. Fill in:
   - **Name:** `files`  
     (Only the subdomain. Do not enter `files.lexicon-legal.ai`; GoDaddy adds the domain.)
   - **Value / Points to:** paste the **exact** CNAME target from Railway (e.g. `lexicon-server-abc123.up.railway.app`).  
     No `https://`, no trailing dot, no path.
   - **TTL:** 1 Hour (or default).
6. Save the record.

Propagation can take from a few minutes up to 24–72 hours. Usually it’s under an hour.

---

## 3. HTTPS/SSL (no extra work)

- Railway issues and renews **Let’s Encrypt** certificates for your custom domain.
- Once the CNAME is correct and visible to Railway, SSL is provisioned automatically (often within about an hour).
- You do **not** need to upload a certificate or change any SSL settings in GoDaddy for this to work.

---

## 4. Verify

1. **DNS (optional):**  
   [dnschecker.org](https://dnschecker.org) → query **CNAME** for **files.lexicon-legal.ai**.  
   It should resolve to the Railway hostname (e.g. `lexicon-server-abc123.up.railway.app`).

2. **App + HTTPS:**  
   Open in a browser:
   ```text
   https://files.lexicon-legal.ai/cases/test/files/medical_records.pdf#page=5
   ```
   - The PDF should open **inline** (not download).
   - The URL should stay as above (no redirect that drops `#page=5`).
   - The padlock should show a valid certificate for `files.lexicon-legal.ai`.

If it doesn’t work yet:
- Wait 15–60 minutes for DNS and SSL, then try again.
- Hard refresh or use an incognito window to avoid cache.
- In Railway, check that the custom domain shows a green check and SSL is “Active” or “Valid”.

---

## Summary

| Step | Where | Action |
|------|--------|--------|
| 1 | Railway | Add custom domain **files.lexicon-legal.ai** and copy the CNAME target. |
| 2 | GoDaddy | Add CNAME: **Name** `files`, **Value** = Railway CNAME target. |
| 3 | — | Wait for DNS + automatic SSL (no manual SSL config). |
| 4 | Browser | Open **https://files.lexicon-legal.ai/cases/test/files/medical_records.pdf#page=5** and confirm PDF + fragment work. |
