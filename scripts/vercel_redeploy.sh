#!/bin/bash
# Trigger Vercel redeployment using project-level deploy hook

if [ -z "$VERCEL_DEPLOY_HOOK" ]; then
  echo "Set VERCEL_DEPLOY_HOOK environment variable (Project > Settings > Git > Deploy Hooks)";
  exit 1;
fi

curl -X POST "$VERCEL_DEPLOY_HOOK" && echo "Triggered Vercel redeploy"; 