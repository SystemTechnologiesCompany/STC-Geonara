# STC Geonara project review

Reviewed 7 November 2026.

## Supplied material

The folder contained 12 Word documents, one standalone HTML dashboard, and a ZIP containing another interactive frontend and a minimal FastAPI starter. The Word files cover the charter, SRS, UI/UX, data model, backend/API architecture, AI, research integrations, backlog, and testing/security/deployment. Several files repeat or expand earlier specifications, and their internal document numbers do not always match their filenames.

The charter describes a broader mobile Earth science ecosystem. The later MVP specifications narrow the first release to dictionary, research, AI, user profiles, and direct messaging, supported by authentication. Advanced GIS, lab tools, payments, public feeds, and courses remain outside that initial scope.

The original standalone dashboard is largely visual: only module switching and an alert are wired. Search, AI submission, messaging, and profile editing are not implemented there. It loads Tailwind, Font Awesome, Google Fonts, and profile images from external services.

The ZIP frontend is more interactive, with local filtering, saved papers, prepared AI answers, profile editing, and simulated messaging. Its research records are placeholders. Its demo login stores credentials in local storage, which is unsuitable for real accounts.

The supplied FastAPI scaffold defines root, health, and module-status routes. It does not implement authentication or any of the five application modules. No actual database, AI connection, research provider, or deployable production system was supplied. The source was reviewed, but the Python backend was not run.

## Implemented refresh

The active site is now named STC Geonara; the assistant is Swingo AI. The refresh uses an earthy green/cream palette related to the original mineral teal, geological blue, and sand direction. It adds a responsive editorial hero with locally generated terrain artwork, small motion effects, reduced-motion support, matching module screens, and mobile navigation.

The working sample catalogue and prepared assistant responses are retained from the interactive prototype. The new website adds searchable terminology translations, persistent local assistant history, better filter feedback, accessible controls, and safe rendering of user-entered text. Demo passwords and fake account requirements are removed.

The website has no package dependencies or build step. Its optional webfonts have system fallbacks. The preview server binds to loopback and serves only an explicit list of website assets, excluding planning documents and archived material.

## Cleanup

Original documents moved into `docs/source`. Original ZIP and dashboard moved into `archive`. No original source material was permanently deleted. Superseded styling, CDN scripts, icon dependencies, and local-password demo logic are excluded from the active website. The originals remain unchanged for comparison.

## Remaining implementation work

1. Resolve the production architecture and mobile-versus-web release scope against the specifications.
2. Implement secure backend authentication, authorization, user isolation, and database migrations.
3. Review scientific definitions and translated terminology with qualified editors.
4. Connect and validate a research metadata provider. Replace placeholder records with attributed, verified metadata.
5. Select an AI provider, implement server-side credentials and usage limits, and evaluate answers and citations. Prepared responses are not a live AI service.
6. Implement private messaging transport and participant access controls before enabling actual communication.
7. Validate the implemented French and Arabic translations with native-speaking scientific editors; the UI and sample educational content now include all three languages and Arabic RTL layouts.
8. Complete the specified security, integration, accessibility, performance, and release checks before a public production launch.

Production readiness cannot be inferred from the visual refresh or local browser checks.
