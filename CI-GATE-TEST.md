# DO NOT MERGE — CI gate smoke test

> **Close this PR without merging.** It exists only to exercise the branch-protection
> gate; merging would leave a stray artifact at the repo root.

Throwaway PR to verify branch-protection on `main`:

- the `build` status check shows as **Required**, and
- "Require branches to be up to date before merging" gates the merge button.

Safe to close without merging. Delete this file afterward.
