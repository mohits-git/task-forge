## TaskForge - Tickets Management Webapp

### With TaskForge you can:
- Create your Agency
- Create multiple Projects
- List of Tickets in a Project
- Invite a 'Team Member' to your Agency
- Grant specific Project access
- Assign tickets to the Project Team Members

### Tech Stack
- NextJS
- Typescript
- @dnd-kit (for Drag and Drop)
- Clerk (for Auth)
- Shadcn
- Tailwind
- Prisma (with PostgreSQL provider)

### Getting Started

```bash
git clone https://github.com/mohits-git/task-forge.git

npm intall
```
Create `.env` file and add env's: 
```
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the project running.


## Rough Sketches I drew during building this project
![Task Forge Visual Docs](https://github.com/mohits-git/task-forge/assets/152606488/8f1a0315-2aa7-4b1e-8354-d81ddc7a9b05)

