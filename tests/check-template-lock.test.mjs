import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  checkTemplateLock,
  classifyContractPath,
  compareLockSnapshots,
  createLockSnapshot,
  readLockContract,
  validateLockContract,
} from "../scripts/check-template-lock.mjs";

function contract(overrides = {}) {
  return {
    version: 1,
    lockedPaths: ["locked.txt"],
    replaceableRoots: ["src/client"],
    clientGeneratedPaths: ["src/**"],
    notes: "Locked template files win over generated client paths.",
    ...overrides,
  };
}

async function temporaryDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), "template-lock-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

test("validates the lock shape and reports malformed JSON", async (t) => {
  assert.equal(validateLockContract(contract()).version, 1);

  assert.throws(
    () => validateLockContract({ ...contract(), extra: true }),
    /Unknown field 'extra'/,
  );
  assert.throws(
    () => validateLockContract({ ...contract(), lockedPaths: [] }),
    /lockedPaths must be a non-empty array/,
  );
  assert.throws(
    () => validateLockContract({ ...contract(), lockedPaths: ["same", "same"] }),
    /lockedPaths must contain unique entries/,
  );
  assert.throws(
    () => validateLockContract({ ...contract(), replaceableRoots: ["../outside"] }),
    /normalized relative path/,
  );

  const rootDir = await temporaryDirectory(t);
  const malformedLock = join(rootDir, "template.lock.json");
  await writeFile(malformedLock, "{ this is not JSON", "utf8");
  await assert.rejects(readLockContract(malformedLock), /Invalid JSON in template lock/);
});

test("recursively snapshots locked directories with stable SHA-256 records", async (t) => {
  const rootDir = await temporaryDirectory(t);
  await mkdir(join(rootDir, "src/template/nested"), { recursive: true });
  await writeFile(join(rootDir, "src/template/a.txt"), "alpha", "utf8");
  await writeFile(join(rootDir, "src/template/nested/b.txt"), "beta", "utf8");
  await writeFile(join(rootDir, "ignored.txt"), "outside", "utf8");

  const lockContract = contract({
    lockedPaths: ["src/template", "src/template/a.txt"],
    clientGeneratedPaths: ["src/**"],
  });
  const snapshot = await createLockSnapshot({ rootDir, contract: lockContract });

  assert.deepEqual(snapshot, {
    version: 1,
    algorithm: "sha256",
    lockVersion: 1,
    records: [
      { path: "src/template/a.txt", bytes: 5, sha256: digest("alpha") },
      { path: "src/template/nested/b.txt", bytes: 4, sha256: digest("beta") },
    ],
  });
  assert.equal(classifyContractPath("src/template/nested/b.txt", lockContract), "locked");
  assert.equal(classifyContractPath("src/elsewhere.ts", lockContract), "clientGenerated");
  assert.equal(classifyContractPath("src/client/logo.svg", lockContract), "clientGenerated");
  assert.equal(classifyContractPath("README.md", lockContract), "template");
});

test("requires every locked path literally instead of expanding globs", async (t) => {
  const rootDir = await temporaryDirectory(t);
  await mkdir(join(rootDir, "locked"), { recursive: true });
  await writeFile(join(rootDir, "locked/actual.txt"), "content", "utf8");

  await assert.rejects(
    createLockSnapshot({
      rootDir,
      contract: contract({ lockedPaths: ["locked/*.txt"] }),
    }),
    /Locked path does not exist.*globs are not expanded/s,
  );
});

test("compares snapshot additions, removals, changes, and lock metadata", () => {
  const previous = {
    version: 1,
    algorithm: "sha256",
    lockVersion: 1,
    records: [
      { path: "changed.txt", bytes: 3, sha256: digest("old") },
      { path: "missing.txt", bytes: 7, sha256: digest("missing") },
    ],
  };
  const current = {
    version: 1,
    algorithm: "sha256",
    lockVersion: 2,
    records: [
      { path: "added.txt", bytes: 5, sha256: digest("added") },
      { path: "changed.txt", bytes: 3, sha256: digest("new") },
    ],
  };

  assert.deepEqual(compareLockSnapshots(previous, current), {
    matches: false,
    missing: ["missing.txt"],
    added: ["added.txt"],
    changed: ["changed.txt"],
    metadata: ["lockVersion"],
  });
});

test("checks an optional persisted snapshot end to end", async (t) => {
  const rootDir = await temporaryDirectory(t);
  const lockFile = join(rootDir, "template.lock.json");
  const snapshotFile = join(rootDir, "template.lock.snapshot.json");
  const lockedFile = join(rootDir, "locked.txt");
  const lockContract = contract();

  await writeFile(lockedFile, "first", "utf8");
  await writeFile(lockFile, JSON.stringify(lockContract), "utf8");
  const initialSnapshot = await createLockSnapshot({ rootDir, contract: lockContract });
  await writeFile(snapshotFile, JSON.stringify(initialSnapshot), "utf8");

  const matching = await checkTemplateLock({ rootDir, snapshotFile });
  assert.equal(matching.ok, true);
  assert.equal(matching.comparison.matches, true);

  await writeFile(lockedFile, "second", "utf8");
  const changed = await checkTemplateLock({ rootDir, snapshotFile });
  assert.equal(changed.ok, false);
  assert.deepEqual(changed.comparison.changed, ["locked.txt"]);
});
