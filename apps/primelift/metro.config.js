// Expo SDK 57 detects pnpm workspaces and follows their symlinks automatically.
// Keeping hierarchical lookup enabled is important: pnpm stores transitive Expo
// modules beside their parent package inside .pnpm/node_modules.
const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
