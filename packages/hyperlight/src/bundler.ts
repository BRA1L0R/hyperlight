import esbuild from 'esbuild'
import path from 'path'
import { gray } from 'colorette'
import { error, info } from './utils/logging'

interface BundlerOptions {
  verbose: boolean
  inputDir: string
  outDir: string
}

export async function bundlePage(
  scriptPath: string,
  options?: Partial<BundlerOptions>
) {
  let build: esbuild.BuildResult
  const entryPoint = path.join(options?.inputDir ?? '', scriptPath)

  const bundleLog = (message: string) =>
    options?.verbose ? info(message) : false

  bundleLog(
    gray(`${new Date().toLocaleTimeString('en-US')} - Detected file change`)
  )
  bundleLog(`Bundling ${entryPoint}\n`)

  try {
    build = await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      external: ['@tinyhttp/app'],
      platform: 'node',
      jsxFactory: 'jsx.fa',
      jsxFragment: 'jsx.fr',
      format: 'esm',
      outdir: options.outDir ?? `.cache/bundled`,
      outbase: 'pages',
      outExtension: {
        '.js': '.mjs'
      },
      splitting: true,
      define: {
        NODE_ENV: 'development'
      }
    })
  } catch (e) {
    error('FAILED!\n')
    error(e.message)
    return
  }

  for (const warning of build.warnings) console.warn(warning)
}
