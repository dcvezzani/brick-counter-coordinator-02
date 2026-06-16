#!/bin/sh
set -a
[ -f .aidlc/dev.env ] && . ./.aidlc/dev.env
set +a

# Port role mapping — see AGENTS.md § Port role mapping (AIDLC)
[ -n "$AIDLC_APP_PORT" ] && export PORT="${PORT:-$AIDLC_APP_PORT}"
[ -n "$AIDLC_API_PORT" ] && export API_PORT="${API_PORT:-$AIDLC_API_PORT}"
[ -n "$AIDLC_DEBUG_PORT" ] && export DEBUG_PORT="${DEBUG_PORT:-$AIDLC_DEBUG_PORT}"

exec "$@"
