import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WhatThePlant',
  slug: 'whattheplant',
  extra: {
    ...config.extra,
    plantNetApiKey: process.env.PLANTNET_API_KEY || 'YOUR_API_KEY',
  },
});
