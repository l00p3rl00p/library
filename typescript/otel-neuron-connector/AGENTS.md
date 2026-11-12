# Agent reference — Neuron Connector library

This repository is a **public, standalone library**. Treat every committed file, comment, test fixture, example, issue, release, and artifact as publicly visible.

## Scope and neutrality

- This is a reusable capability library, **not** a project assignment, deployment, application, or plugin.
- An agent's authorized application instructions determine what to connect, observe, retain, route, and publish. Do not assume a particular provider, private repository, system, runtime, or workflow.
- Keep the core independent of consumers. Application-specific integration belongs in separate adapters or consuming applications.
- Describe the Neuron Connector's general mechanism in source-neutral terms; treat any particular telemetry transport as one possible adapter, not the entire theory.
- Reuse proven interfaces and libraries rather than recreating collectors, protocol implementations, routing systems, or data stores.
- Build and verify one actual input → connector → output chain before extending inputs and then outputs.

## Public-repository information boundaries

- **Never publish or reference private repositories, unpublished project paths, internal service names, credentials, session identifiers, hostnames, internal URLs, or internal architecture.**
- Do not copy private source, chat transcripts, operational logs, screenshots, tokens, or configuration into documentation, examples, issues, test fixtures, commits, package metadata, or release archives.
- Examples and tests must use generic names, non-sensitive fixtures, and public standards. Avoid using private-source data even if it can be anonymized.
- If a request draws on private or connected material, extract only the general reusable interface or mechanism. The private origin is not library documentation.
- Do not invent source identifiers, connections, relationship facts, capabilities, or verification results. Distinguish observed behavior from proposed design.
- Credit any **public** upstream implementations and respect their licenses; do not expose a private source in the name of attribution.
- Do not automatically commit or push material from an agent conversation. Check authorization and the exact destination first.

## Before changing or publishing

1. Inspect current source, tests, public documentation, and `git status`; keep changes surgical.
2. Check availability of `node`, `npm`, TypeScript compiler, `shellcheck`, `gitleaks`, and `git-secrets`. Missing tools are **NOT RUN**, not PASS.
3. Run `npm test` and `npm pack --dry-run`; run the notebook's executable test when affected.
4. Run `bash -n` and ShellCheck on changed shell scripts.
5. Run available secret scanners on files and Git history, then review the diff and package contents for private references and metadata. Treat a clean secret scan as necessary, not sufficient, for public-safe content.
6. Run `git diff --check`; stage only intended files. Preserve independent Git history.
7. Require direct execution evidence for claims of transport acceptance, receiver delivery, or durable storage. Tests of an in-process interface do not prove a remote destination.

## Release discipline

Inspect → make the smallest useful change → test → scan → review → commit → package → verify package contents and checksum → publish when authorized.

Maintain independent semantic versions and public API contracts. Consumers adopt tested dependency versions separately. Do not rewrite Git history or silently alter consumer deployments.
