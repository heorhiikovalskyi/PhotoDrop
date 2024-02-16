require('esbuild')
  .build({
    entryPoints: ['./afterImageUpload.ts'],
    outfile: 'afterImageUpload.js',
    bundle: true,
    loader: { '.ts': 'ts' },
    external: ['./opt/nodejs/node_modules/sharp'],
    platform: 'node',
  })
  .then(() => console.log('⚡ Done'))
  .catch(() => process.exit(1));
