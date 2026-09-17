# TrustLedger SRM V2 Provisional Assumptions

**Status:** Experimental build. No production claims. All decisions are provisional pending Frappe compatibility assessment.

**Last updated:** September 2026

This document captures the provisional technical decisions made for the Projects vertical slice (Phase 1). All choices are experimental and subject to revision when the backend architecture receives final approval or when Frappe integration is assessed.

---

## 1. Backend technology and database

### Current assumption (provisional)

- **Framework:** Next.js 16 App Router (existing)
- **Backend:** Next.js Route Handlers and Server Actions (existing)
- **Database:** PostgreSQL (portable, not provider-specific)
- **ORM:** Drizzle ORM (type-safe, transparent SQL, replaceable)
- **Validation:** Zod (shared schemas, authoritative on server)

### Rationale

Matches the existing frontend framework and avoids custom auth implementation while remaining extensible.

### Frappe compatibility risk

**HIGH.** Frappe is a Python/Django-based framework with its own data model, API layer, and permission system. If the final decision is to use Frappe as the backend:

- This entire Next.js Route Handler and Server Action layer may need to be replaced with Frappe API calls.
- Drizzle ORM and PostgreSQL raw access will be superseded by Frappe's ORM.
- Authentication will be redirected to Frappe's session model.
- Validation may move to Frappe DocTypes and controllers.

### Mitigation

- **Data access layer:** All database interactions are isolated behind repository interfaces (see `src/server/repositories/projects.ts`). Swapping Drizzle for Frappe API calls requires changing only these repositories and their callers, not the entire application.
- **No ORM coupling:** Business logic does not depend on Drizzle-specific patterns. Queries are explicit and portable.
- **Clear boundaries:** Server Actions call domain services; domain services call repositories. Repositories return typed domain objects, not ORM instances.

---

## 2. Hosting provider and region

### Current assumption (provisional)

- **Hosting:** Vercel (existing)
- **Region:** US-East (Vercel default)
- **Database hosting:** Not yet decided

### Rationale

Matches the existing frontend deployment; allows rapid iteration.

### POPIA and residency risk

**HIGH.** South Africa requires personal data to remain within South African borders or explicitly approved processing agreements. Hosting in US-East may violate POPIA if:

- Client organisations store personal data (stakeholder names, contact information, grievance details).
- No explicit legal basis exists for cross-border transfer.
- A data-processing agreement has not been executed with Vercel.

### Mitigation

- **Deferred decision:** The Projects slice does not store personal data initially (only fictional project names and attributes).
- **Adapter pattern:** Database region is not hardcoded. When regional requirements are confirmed, the connection string can be updated in environment variables without code changes.
- **Legal review required before real data:** No client organisations should be onboarded to this environment until POPIA review is complete and regional hosting is approved.

---

## 3. Organisation and project-level access control

### Current assumption (provisional)

- **Multi-tenancy:** Single organisation for the experimental build.
- **Project access:** No row-level security at the database level. All authenticated users see all projects.
- **Project membership:** Not yet implemented.
- **Roles and permissions:** Placeholder roles only. No permission matrix enforced.

### Rationale

Simplifies the first vertical slice to focus on data persistence, not authorization.

### Production risk

**CRITICAL.** This architecture allows any authenticated user to:

- View all projects in any organisation.
- Create, edit, or delete any project.
- Bypass project membership restrictions.

This is **unsafe for real client data.**

### Mitigation

- **Mandatory before pilot:** Implement organisation scoping (every query includes `organisation_id`).
- **Mandatory before pilot:** Implement project membership checks in Server Actions.
- **Mandatory before pilot:** Add database row-level security constraints or application-level authorization decorators.
- **Clear labelling:** The experimental build UI displays "V2 Experimental Build" and "Prototype environment" warnings.
- **No real data:** Do not use this environment for real client organisations or sensitive data until authorization is production-ready.

---

## 4. Data retention

### Current assumption (provisional)

- **Retention policy:** Not defined.
- **Deletion:** Soft deletes (archival) only. No hard deletes are exposed in the UI.
- **Audit trail:** Mutations are logged, but audit queries are not exposed.
- **POPIA deletion requests:** Not yet implemented.

### Rationale

Avoids accidental data loss during experimentation.

### Legal and operational risk

**HIGH.** POPIA requires organisations to:

- Honour data-subject deletion requests within 30 days.
- Define retention periods per data classification.
- Provide a mechanism for organisations to comply with deletion requests.

### Mitigation

- **Audit events are recorded:** Every mutation includes a timestamp and actor. This foundation supports future audit queries.
- **Soft deletion foundation:** Archival flags are in place for future deletion workflows.
- **Legal review required:** Before real client data is stored, retention schedules and deletion workflows must be documented and reviewed by legal counsel.

---

## 5. Evidence storage

### Current assumption (provisional)

- **Scope:** Evidence storage is not implemented in the Projects slice.
- **Future plan:** Files will be stored in private S3-compatible object storage with signed URLs and download auditing.
- **Initial MVP:** No file upload in this phase.

### Rationale

Focuses the first slice on project records only. File handling adds complexity and security considerations.

### Future migration path

When evidence storage is added:

1. Create an `S3StorageAdapter` interface.
2. Implement upload/download/delete methods.
3. Call the adapter from domain services (e.g., `createProjectAttachment`).
4. All storage operations will be auditable through the same audit layer.

---

## 6. Legal and POPIA responsibilities

### Current assumption (provisional)

- **Legal review status:** Not completed.
- **Data processor:** Unclear. TrustLedger? Chibase? Organisation itself?
- **Lawful basis:** Unclear.
- **Personal data classification:** Not yet defined.
- **Consent mechanism:** Not yet defined.
- **Data-subject rights:** Not yet supported (access, correction, deletion requests).
- **Breach notification:** No process defined.

### Rationale

The experimental build focuses on technical feasibility, not legal compliance. Decisions are deferred to the legal review phase.

### Risk and mitigation

**CRITICAL RISK:** Deploying this system with real client data before legal review violates POPIA and exposes TrustLedger and Chibase Consulting to regulatory action, fines, and reputational damage.

**MANDATORY ACTIONS before pilot:**

1. Determine the data controller and processor role for each deployment context.
2. Define the lawful basis for data processing (e.g., contract, consent, legitimate interest).
3. Document personal-data categories collected and processed.
4. Create a privacy notice and provide it to data subjects.
5. Define retention schedules per data classification.
6. Establish a process for data-subject access, correction, and deletion requests.
7. Execute data-processing agreements with any third-party processors (Vercel, database provider, storage provider).
8. Define breach-notification procedures.
9. Conduct a Data Protection Impact Assessment (DPIA) if required.
10. **Do not onboard real client data until legal review is complete and documented.**

---

## 7. Components requiring revision for Frappe compatibility

When the Frappe assessment is completed, the following components will require significant changes:

### Backend API layer (high impact)

- `src/server/actions/projects.ts` — Server Actions will be replaced with Frappe HTTP API calls
- `src/server/repositories/projects.ts` — Drizzle queries will be replaced with Frappe REST/JSON-RPC calls
- `src/server/services/projects.ts` — Business logic may move into Frappe DocType methods or controllers

### Data models (medium impact)

- `src/types/project.ts` — Zod schemas may be generated from Frappe DocType definitions
- Database schema (migrations) — Replaced with Frappe DocType definitions and field configurations

### Authentication (medium impact)

- Session/cookie handling in middleware — Will be replaced with Frappe session tokens
- User context extraction — Will use Frappe's `frappe.session.user` pattern

### Not affected (low impact)

- UI components and React logic — Should remain largely unchanged if repositories return consistent domain objects
- Styling and navigation — Completely independent
- Report building logic — Can wrap Frappe queries; business logic remains similar

---

## 8. Configuration for flexibility

### Environment variables (set in `next.config.js` or `.env.development.local`)

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://...

# Backend strategy (for future switching)
BACKEND_STRATEGY=next-js  # or "frappe" when ready

# Frappe (if switching to Frappe backend)
# FRAPPE_API_URL=http://frappe.example.com
# FRAPPE_API_KEY=...
# FRAPPE_API_SECRET=...

# Hosting and region
VERCEL_ENV=development
NEXT_PUBLIC_APP_ENV=development

# Data retention (configurable per organisation)
DATA_RETENTION_DAYS=365
ENABLE_AUDIT_LOGGING=true
```

### Adapter pattern (existing)

All data access goes through repository interfaces:

```typescript
// Existing pattern
export interface ProjectRepository {
  findAll(organisationId: string): Promise<Project[]>
  findById(organisationId: string, projectId: string): Promise<Project | null>
  create(organisationId: string, project: CreateProjectInput): Promise<Project>
  update(organisationId: string, projectId: string, updates: UpdateProjectInput): Promise<Project>
  delete(organisationId: string, projectId: string): Promise<void>
}

// Drizzle implementation (current)
export const projectRepositoryDrizzle: ProjectRepository = { ... }

// Frappe implementation (future)
export const projectRepositoryFrappe: ProjectRepository = { ... }

// Adapter selection (runtime or build-time)
export const projectRepository = process.env.BACKEND_STRATEGY === 'frappe'
  ? projectRepositoryFrappe
  : projectRepositoryDrizzle
```

---

## 9. Experimental build markers

All code and UI include markers indicating experimental status:

- UI header: "V2 Experimental Build"
- Warnings: "Prototype environment"
- Comments: `// @experimental` tags on provisional code paths
- Console messages: `[v0] Projects slice experimental implementation`

---

## 10. Approval gates before advancing

Do not proceed beyond the Projects vertical slice without:

1. **Technical decision:** Database provider, region, and backend strategy confirmed
2. **Legal decision:** POPIA data controller/processor roles determined
3. **Access control decision:** Organisation scoping and project membership rules approved
4. **Data retention decision:** Retention schedules and deletion workflows defined
5. **Frappe assessment:** Frappe compatibility evaluated; decision made to integrate or continue with Next.js
6. **Security review:** Authentication, authorization, and encryption reviewed

---

## References

- TrustLedger SRM V2 Consolidated Technical Design
- POPIA (Protection of Personal Information Act, 2013)
- Frappe Framework documentation (if integration is pursued)
- Next.js 16 documentation
- Zod validation documentation
