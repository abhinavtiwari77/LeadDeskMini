# LeadDesk Mini - 2 to 3 Minute Video Walkthrough Script

Use this structured script to present the **LeadDesk Mini** full-stack submission in a clean, concise 2-3 minute Loom recording.

---

## Recording Sequence Checklist

- [ ] **0:00 - 0:25** | Landing Page Overview & Design Aesthetics
- [ ] **0:25 - 0:55** | Form Submission & Client/Server Validation Demonstration
- [ ] **0:55 - 1:15** | Unauthenticated Route Protection & Admin Login
- [ ] **1:15 - 1:45** | Admin Dashboard, Live Metrics, & Debounced Search
- [ ] **1:45 - 2:20** | Immediate MongoDB Status Update & Confirmation Dialog
- [ ] **2:20 - 2:30** | Session Logout & Mandatory Footer Verification

---

## Detailed Speaking Script

### 1. Landing Page (0:00 - 0:25)
> "Hi everyone! Welcome to **LeadDesk Mini**, a high-performance lead capture engine built with React, Vite, TailwindCSS, Express, and MongoDB.
>
> As you can see on the landing page, we've designed a clean, modern SaaS aesthetic inspired by Linear and Vercel. It features a hero section, value proposition, metric badges, feature breakdown, and our lead capture form."

---

### 2. Submit Lead & Validation (0:25 - 0:55)
> "Now let's submit a lead. We have strict multi-layer validation using Zod on both the client and Express server.
>
> If I try to submit empty or invalid fields, we get immediate inline validation errors. Let's fill out a valid lead:
> - Name: `Sarah Connor`
> - Work Email: `sarah@cyberdyne.io`
> - Budget Range: `$1000-$5000`
> - Message: `We want to evaluate LeadDesk Mini for our enterprise sales team.`
>
> When I click 'Submit Lead Request', our React form sends a POST request to `/api/leads`. We get an immediate success toast notification and the lead is persisted to MongoDB with default status `New`."

---

### 3. MongoDB & Unauthenticated Route Protection (0:55 - 1:15)
> "Now let's try accessing the protected Admin Dashboard directly at `/admin`.
>
> Notice how our `ProtectedRoute` guard detects that we don't have an active session and automatically redirects us to `/login`.
>
> On the login screen, credentials are never hardcoded in source. We provide an auto-fill button for demo credentials (`admin@leaddesk.com`). When I click Sign In, the server validates bcrypt hashes, generates a JWT, and attaches it securely inside an `HttpOnly` cookie."

---

### 4. Admin Dashboard & Debounced Search (1:15 - 1:45)
> "Now that we're authenticated, we land on the **Admin Lead Desk**.
>
> Here we have high-level metric cards showing total inbound leads, new leads, contacted leads, and closed deals.
>
> We also have real-time debounced search. As I type `Sarah`, the table instantly filters by name or email without unnecessary re-renders. We can also filter by status tabs like `New`, `Contacted`, or `Closed`."

---

### 5. Immediate Status Change & Confirmation Dialog (1:45 - 2:20)
> "Let's update the status of Sarah Connor's lead from `New` to `Contacted`.
>
> To prevent accidental status updates, a modal pops up asking for confirmation. Upon clicking 'Update Status', a `PATCH` request hits `/api/leads/:id/status`. The MongoDB document updates immediately, our UI stats refresh, and a success toast confirms the change."

---

### 6. Logout & Mandatory Footer (2:20 - 2:30)
> "Finally, let's click 'Logout'. The server clears the `HttpOnly` cookie, destroying the session.
>
> And on every page, as required by the assignment specs, you'll find the mandatory footer: **'Built for Digital Heroes Training Task'** linked directly to `https://digitalheroesco.com`.
>
> Thank you for reviewing LeadDesk Mini!"
