- source_spec: `d:/Downloads/New folder/_bmad-output/implementation-artifacts/spec-luxury-typography-reveal.md`
  summary: Remove or update the legacy _update_slow.py script so it cannot overwrite the current reveal CSS contract.
  evidence: The pre-existing untracked script rewrites the full reveal section with older timing and removes the new heading-clip, event-stage, and reduced-motion rules if someone executes it.

- source_spec: `D:\Downloads\New folder/_bmad-output/implementation-artifacts/spec-shared-wishes-guestbook.md`
  summary: Sync scripts/google-apps-script.js with the 3-sheet APPS_SCRIPT_SNIPPET and add optional wish-sync test controls in InviteGeneratorPage.
  evidence: scripts/google-apps-script.js has pre-existing drift from commit cf5de2b (1-sheet script pointing to legacy sheet ID 18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo), and admin wish-testing UI is a separate enhancement outside this bugfix.
