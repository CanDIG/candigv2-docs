#!/usr/bin/env bash
#
# docs-merge-report.sh
#
# Generates a pre-merge risk report for merging one docs branch into another
# (e.g. develop -> stable at release time). Run this BEFORE you start
# resolving conflicts so you know exactly what you're dealing with.
#
# Usage:
#   ./docs-merge-report.sh [base-branch] [head-branch]
#
# Defaults: base=stable, head=develop
#
# Requires: git (run from inside a clone of the repo, with both branches
# fetched, e.g. `git fetch origin stable develop`)

set -euo pipefail

BASE="${1:-stable}"
HEAD="${2:-develop}"

# Resolve to local refs, falling back to origin/<branch> if needed
resolve_ref() {
  local ref="$1"
  if git rev-parse --verify --quiet "$ref" >/dev/null; then
    echo "$ref"
  elif git rev-parse --verify --quiet "origin/$ref" >/dev/null; then
    echo "origin/$ref"
  else
    echo "ERROR: could not resolve ref '$ref'" >&2
    exit 1
  fi
}

BASE_REF=$(resolve_ref "$BASE")
HEAD_REF=$(resolve_ref "$HEAD")

MERGE_BASE=$(git merge-base "$BASE_REF" "$HEAD_REF")

echo "# Docs merge report: \`$HEAD\` -> \`$BASE\`"
echo
echo "- Base branch: \`$BASE\` ($BASE_REF)"
echo "- Head branch: \`$HEAD\` ($HEAD_REF)"
echo "- Merge base:  \`$MERGE_BASE\`"
echo

# Compare the two branch tips directly. git's name-status output already
# splits files cleanly into three buckets we care about:
#   M = present on both sides AND content actually differs -> real
#       candidate for a merge conflict, needs a human to compare both sides.
#   A = only exists on HEAD -> new incoming content, low risk.
#   D = only exists on BASE -> HEAD deleted/renamed it. Could be intentional
#       restructuring, or could be a doc quietly getting dropped. Always
#       worth a sanity check before merging.
NAME_STATUS=$(git diff --name-status "$BASE_REF" "$HEAD_REF")

HIGH_RISK=$(echo "$NAME_STATUS" | awk -F'\t' '$1 ~ /^M/ {print $2}')
DELETED_IN_HEAD=$(echo "$NAME_STATUS" | awk -F'\t' '$1 ~ /^D/ {print $2}')
NEW_IN_HEAD=$(echo "$NAME_STATUS" | awk -F'\t' '$1 ~ /^A/ {print $2}')

echo "## Files changed on both sides (need manual review) — $(echo "$HIGH_RISK" | grep -c . || echo 0)"
echo
if [ -z "$HIGH_RISK" ]; then
  echo "_None._"
else
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    STAT=$(git diff --shortstat "$BASE_REF" "$HEAD_REF" -- "$f" | sed 's/^ *//')
    echo "- \`$f\` — $STAT"
  done <<< "$HIGH_RISK"
fi

echo
echo "## In \`$BASE\` but missing from \`$HEAD\` (verify this is intentional, not a lost doc) — $(echo "$DELETED_IN_HEAD" | grep -c . || echo 0)"
echo
if [ -z "$DELETED_IN_HEAD" ]; then
  echo "_None._"
else
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    echo "- \`$f\`"
  done <<< "$DELETED_IN_HEAD"
fi

echo
echo "## New in \`$HEAD\`, not yet in \`$BASE\` (incoming content, informational) — $(echo "$NEW_IN_HEAD" | grep -c . || echo 0)"
echo
if [ -z "$NEW_IN_HEAD" ]; then
  echo "_None._"
else
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    echo "- \`$f\`"
  done <<< "$NEW_IN_HEAD"
fi

echo
echo "---"
echo "Tip: for any file with no shared history back to the merge base (git will"
echo "report it as an 'add/add' conflict rather than a normal 3-way conflict),"
echo "git cannot show you a meaningful diff during the merge itself. Compare the"
echo "two versions directly ahead of time with:"
echo
echo "  git diff $BASE_REF $HEAD_REF -- path/to/file"
echo
echo "so you know what you're reconciling before you hit the conflict markers."
