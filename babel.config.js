module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': '.',
            '@components': './components',
            '@auth': './components/auth',
            '@services': './components/services',
            '@localization': './components/localization',
            '@hooks': '/hooks',
            '@styles': './assets/styles',
            '@blog': './components/blog'
          },
        },
      ],
    ],
  };
};
