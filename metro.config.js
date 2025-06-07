const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix color-convert module resolution issue in SDK 53
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === './route' && context.originModulePath && context.originModulePath.includes('color-convert')) {
    // Resolve to the correct color-convert route.js file
    const colorConvertPath = path.dirname(context.originModulePath);
    const routePath = path.join(colorConvertPath, 'route.js');
    
    return {
      filePath: routePath,
      type: 'sourceFile',
    };
  }
  
  // Fall back to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;