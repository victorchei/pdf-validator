#!/bin/bash

cd "$(dirname "$0")"
npm run compile
echo "✅ Rebuild complete. Run 'Developer: Reload Window' in VS Code (Cmd+Shift+P)"
