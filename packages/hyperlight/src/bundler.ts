import esbuild from 'esbuild'
import path from 'path'
import chalk from 'chalk'
import { info } from './logging'

interface BundlerOptions {
  verbose: boolean
  outDir: string
}

export async function bundlePage(
  scriptPath: string,
  options?: Partial<BundlerOptions>
) {
  let build: esbuild.BuildResult
  const entryPoint = path.join(options?.outDir ?? 'pages', scriptPath)

  const bundleLog = (message: string) =>
    options?.verbose ? info(message) : false

  bundleLog(
    chalk.grey(
      `${new Date().toLocaleTimeString('en-US')} - Detected file change`
    )
  )
  bundleLog(chalk.white(`Bundling ${entryPoint}\n`))

  try {
    build = await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      external: ['@tinyhttp/app'],
      platform: 'node',
      jsxFactory: 'jsx',
      jsxFragment: 'Fragment',
      format: 'esm',
      outdir: `.cache/bundled`,
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
    bundleLog('FAILED!\n')
    console.error(e.message)
    return
  }

  for (const warning of build.warnings) console.warn(warning)
}
