# Deploying lexicon-server to Railway

## Important: PORT and large files

- The server already uses `process.env.PORT || 3001`, so Railway’s `PORT` is used in production.
- **Storage is part of the repo:** Commit the `storage/` directory (and your PDFs). The app reads from `./storage/` at runtime, so it must be present in the deployed image.
- **Large PDFs (~50MB):** Railway does **not** enforce a max response body size. The limit is a **5-minute HTTP timeout**. Streaming a 50MB PDF usually finishes well under that. If the client is very slow, the connection could time out; for normal broadband, 50MB is fine.

---

## Step 1: Create a Railway account

1. Go to [railway.app](https://railway.app).
2. Click **Login** and sign in with **GitHub** (easiest if your code is on GitHub).
3. If you’re new, you may get a trial; after that you use the **Hobby** plan ($5/month with included usage). There is no permanent free tier; the free trial gives credit to try it.

---

## Step 2: Put the project in Git and push (if not already)

From your machine, in the project root (e.g. `lexicon-server/`):

```bash
cd /path/to/lexicon-server
git init
git add .
git commit -m "Initial commit: Express PDF server"
```

Create a new repo on GitHub (e.g. `lexicon-server`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/lexicon-server.git
git branch -M main
git push -u origin main
```

**Critical:** Your PDFs must be in the repo for this deploy method. Do **not** add `storage/` to `.gitignore` if you want those files on Railway. For a ~50MB file, Git and GitHub are fine (GitHub warns at 50MB, hard limit 100MB). If you prefer not to put large binaries in Git, use the “Deploy from CLI” option and include `storage/` there (see Step 2b).

---

## Step 2b (alternative): Deploy from your machine with Railway CLI

If you don’t want to push PDFs to GitHub:

1. Install Railway CLI: `npm i -g @railway/cli` (or see [railway.app/help/cli](https://railway.app/help/cli)).
2. Run `railway login` and complete the browser login.
3. In your project directory: `railway init` (create or link a project).
4. Deploy: `railway up`.

Railway will bundle the current directory (including `storage/`) and deploy it. No GitHub repo required for this path.

---

## Step 3: Create a new project and connect the repo (Git path)

1. In the Railway dashboard, click **New Project**.
2. Choose **Deploy from GitHub repo**.
3. Select the repo (e.g. `lexicon-server`) and the branch (e.g. `main`).
4. Railway will detect Node.js and use your `package.json` scripts.

---

## Step 4: PORT and start command

- Railway sets **`PORT`** automatically. Your app already uses `process.env.PORT || 3001`, so no extra env vars are required.
- Railway will run **build:** `npm run build` (or the build command you set).
- Railway will run **start:** `npm start` (i.e. `node dist/server.js`).

You can leave the default **Start Command** empty so it uses `npm start` from `package.json`.

---

## Step 5: Deploy and get the public URL

1. After connecting the repo, Railway runs a build and deploy automatically.
2. Open your service → **Settings** → **Networking** → **Generate Domain**.
3. You’ll get a URL like:  
   `https://lexicon-server-production-xxxx.up.railway.app`

---

## Step 6: Verify

Open in a browser:

- `https://YOUR-RAILWAY-URL/cases/test/files/medical_records.pdf`  
  The PDF should open inline (not download).
- With a fragment:  
  `https://YOUR-RAILWAY-URL/cases/test/files/medical_records.pdf#page=18`  
  The browser should open at page 18 (fragment is preserved because the app streams the PDF and does not redirect).

---

## If Railway is problematic: Render

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. **New** → **Web Service** → connect the same repo.
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm start`
5. **Environment:** Add `PORT` only if Render doesn’t set it (Render usually sets `PORT`; your app already uses it).
6. Create the service; Render will assign a URL like `https://lexicon-server-xxxx.onrender.com`.

Same rules: commit `storage/` (and your PDFs) so they’re in the deployed image, or use a deploy path that includes `storage/` (e.g. deploy from a branch that has the files). Render also doesn’t impose a response body limit; request timeout is the main constraint (often 30 s–5 min depending on plan).

---

## Summary

| Concern | Answer |
|--------|--------|
| PORT | Set by Railway/Render; app uses `process.env.PORT \|\| 3001`. |
| Include `storage/` | Commit it (and the PDFs) and deploy from repo, or use `railway up` so the folder is bundled. |
| 50MB PDF | No response size limit; 5‑min timeout on Railway. Streaming 50MB is fine for normal connections. |
| Free tier | Railway: trial then Hobby ($5/mo). Render: free tier available with cold starts. |
