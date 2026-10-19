#!/usr/bin/env sh
# Local in-house CI for Forge Lab (no GitHub Actions; zero paid minutes).
# Run from anywhere: sh labs/ci/run-ci.sh
set -u
cd "$(dirname "$0")" || exit 2
echo "== success-class check =="
python3 check_success_class.py checks.txt
status=$?
echo "exit code: $status"
exit $status
