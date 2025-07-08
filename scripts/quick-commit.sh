#!/bin/bash
MSG=$1

if [ -z "$MSG" ]; then
  echo "❌ Commit message required"
  exit 1
fi

git add .
git commit -m "$MSG"
git push
