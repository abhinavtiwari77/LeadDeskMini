# Contributing to LeadDesk Mini

Thanks for contributing! This project follows a small, structured commit history for clarity.

Commit conventions (examples used in this repo):
- `chore:` non-functional changes (repo config, tooling)
- `feat(client):` new frontend features
- `feat(server):` new backend features
- `fix:` bug fixes
- `docs:` documentation updates

Running locally
1. Backend
   ```bash
   cd server
   npm install
   npm run seed   # seeds demo admin
   npm run dev
   ```
2. Frontend
   ```bash
   cd client
   npm install
   npm run dev
   ```

Pushing
- This repo uses standard GitHub push. Create feature branches and open PRs for changes.

Code style
- Tailwind classes and React components. Keep components small and reusable.
