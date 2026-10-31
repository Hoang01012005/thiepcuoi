# DEPLOYMENT & ROLLBACK GUIDE (Agent 6)

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **Package Manager**: `npm` (v9+).
- **Cloudflare Account**: With Cloudflare Workers / Pages access configured if deploying to edge.
- **Wrangler CLI**: `npm install -g wrangler` (or via `npx wrangler`).

---

## 2. Local Development & Verification

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Test personalized guest invitations by appending `?to=Tên+Khách` (e.g. `http://localhost:5173/?to=Bác+Hùng`).

### Step 3: Run Production Build
```bash
npm run build
```
This runs TypeScript checking (`tsc -b`) followed by Vite optimization (`vite build`). Output directory is `./dist/`.

---

## 3. Production Deployment Options

### Option A: Cloudflare Pages / Workers (Recommended)
1. Login to Cloudflare via CLI:
   ```bash
   npx wrangler login
   ```
2. Deploy the Worker and static assets:
   ```bash
   npx wrangler deploy
   ```
   *Note: Ensure `wrangler.jsonc` or `wrangler.toml` specifies `worker.js` as the main script and `./dist` as the static assets directory.*

### Option B: GitHub Pages / Static Hosting (Vercel, Netlify)
1. Push branch to GitHub:
   ```bash
   git push origin feature/luxury-wedding-redesign
   ```
2. Configure build settings in host dashboard:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Node Version:** `20.x`

---

## 4. Rollback Strategy
If any unforeseen issue arises post-deployment:
1. **Cloudflare Rollback:**
   Go to Cloudflare Dashboard -> **Workers & Pages** -> Select project -> **Deployments** -> Click `...` on the previous known stable version -> **Rollback to this deployment**.
2. **Git Rollback:**
   ```bash
   git checkout main
   git revert HEAD
   git push origin main
   ```
   Instant build pipeline will redeploy the previous stable build.
