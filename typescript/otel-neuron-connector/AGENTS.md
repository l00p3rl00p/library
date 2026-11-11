# AGENTS.md — OTel Neuron Connector

## Scope
- Maintain a standalone, framework-independent library. The native DSH Cordis plugin is a separate consumer.
- Reuse, improve, or extend V1 seams. Never recreate an OTel Collector, OTLP protocol, exporter pipeline, or database.
- Build and test one working observation chain before adding inputs or destinations.

## Checks before editing or publishing
1. Inspect files and `git status`; preserve unrelated work.
2. Check tool availability: `node`, `npm`, `tsc`, `shellcheck`, `gitleaks`, `git-secrets`.
3. Run `npm test`, `npm pack --dry-run`, and `python test/marimo_equivalent.py`.
4. For changed shell scripts, run `bash -n` and ShellCheck.
5. Scan working files and Git history with available Gitleaks; run configured git-secrets where installed. Missing tools are NOT RUN, never PASS.
6. Inspect `git diff --check`, stage only intended files, and review Actions results.
7. Never commit secrets or live endpoints with credentials.
8. Never claim end-to-end ClickHouse persistence without verifying a unique record in the actual ClickHouse store.

## Git discipline
Test → scan → commit → package → inspect manifest and checksum → publish. Do not rewrite history or overwrite repositories. Pin tested library dependencies only at the consumer/plugin release boundary.
