#!/usr/bin/env bash
# Builds Torque into one file: server/target/torque.jar
# (the React app is compiled first and packed inside the Java server).
set -euo pipefail
cd "$(dirname "$0")"
echo "1/3  Checking lesson content…"
(cd web && npm install --silent && npm run check:content)
echo "2/3  Building the React app…"
(cd web && npm run build)
echo "3/3  Building and testing the Java server…"
(cd server && mvn -q package)
echo
echo "Done. Start Torque with:"
echo "  java -jar server/target/torque.jar"
echo "then open http://localhost:8080"
echo "(Set ANTHROPIC_API_KEY first to turn on the AI mentor.)"
