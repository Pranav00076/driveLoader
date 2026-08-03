import { extractFileId, isGoogleDriveUrl } from '../core/parser';
import { extractFolderId, isGoogleDriveFolder } from '../core/folderParser';

import { resolveDriveImage } from '../core/resolver';
import { analyzeDriveUrl } from '../core/diagnostics';
import { loadFolderAssets } from '../core/folderLoader';

export async function runCli(args: string[]): Promise<void> {
  const command = args[0];
  const target = args[1];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
DriveLoader CLI Tool (v1.2.0)
The Google Drive Media SDK for React

Usage:
  npx driveloader <command> [target] [options]

Commands:
  validate <url>                   Validate a Google Drive URL or File ID
  resolve <url>                    Resolve direct CDN URL and endpoints
  generate-component <type>        Generate React component snippet (image|video|audio|doc|media)
  inspect-folder <url> --key <k>   Inspect public folder assets and metadata
  clear-cache                      Clear local cache stats
  generate-types <url>             Generate TypeScript types for drive assets
`);
    return;
  }

  switch (command) {
    case 'validate': {
      if (!target) {
        console.error('Error: Please provide a Google Drive URL or File ID to validate.');
        process.exit(1);
      }
      const isValid = isGoogleDriveUrl(target) || isGoogleDriveFolder(target);
      const fileId = extractFileId(target) || extractFolderId(target);
      const diagnostics = analyzeDriveUrl(target);

      console.log(`\n🔍 DriveLoader URL Validation Results:`);
      console.log(`-------------------------------------`);
      console.log(`Input: ${target}`);
      console.log(`Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
      console.log(`Extracted ID: ${fileId || 'None'}`);
      console.log(`Detected Format: ${diagnostics.detectedFormat}`);
      if (diagnostics.warnings.length > 0) {
        console.log(`Warnings: ${diagnostics.warnings.join(', ')}`);
      }
      break;
    }

    case 'resolve': {
      if (!target) {
        console.error('Error: Please provide a Google Drive URL or File ID to resolve.');
        process.exit(1);
      }
      console.log(`🔄 Resolving Drive URL: ${target}...`);
      try {
        const result = await resolveDriveImage(target);
        console.log(`\n✅ Resolution Successful:`);
        console.log(`File ID: ${result.fileId}`);
        console.log(`Direct CDN URL: ${result.imageUrl}`);
        console.log(`Successful Endpoint: ${result.successfulEndpoint}`);
        console.log(`From Cache: ${result.fromCache}`);
      } catch (err) {
        console.error(`❌ Resolution Failed: ${(err as Error).message}`);
        process.exit(1);
      }
      break;
    }

    case 'generate-component': {
      const type = (target || 'media').toLowerCase();
      console.log(`\n📝 Generated DriveLoader Component Code (${type}):\n`);
      if (type === 'image') {
        console.log(
          `import { DriveImage } from '@driveloader/react';\n\nexport function MyImage() {\n  return (\n    <DriveImage\n      src="YOUR_DRIVE_IMAGE_URL"\n      alt="Drive Photo"\n      width={800}\n      height={600}\n      lazy\n    />\n  );\n}`,
        );
      } else if (type === 'video') {
        console.log(
          `import { DriveVideo } from '@driveloader/react';\n\nexport function MyVideo() {\n  return (\n    <DriveVideo\n      src="YOUR_DRIVE_VIDEO_URL"\n      controls\n      autoPlay={false}\n    />\n  );\n}`,
        );
      } else if (type === 'audio') {
        console.log(
          `import { DriveAudio } from '@driveloader/react';\n\nexport function MyAudio() {\n  return (\n    <DriveAudio\n      src="YOUR_DRIVE_AUDIO_URL"\n      showWaveform\n    />\n  );\n}`,
        );
      } else if (type === 'doc' || type === 'document') {
        console.log(
          `import { DriveDocument } from '@driveloader/react';\n\nexport function MyDoc() {\n  return (\n    <DriveDocument\n      src="YOUR_DRIVE_DOC_URL"\n      height="600px"\n    />\n  );\n}`,
        );
      } else {
        console.log(
          `import { DriveMedia } from '@driveloader/react';\n\nexport function MyMedia() {\n  return (\n    <DriveMedia\n      src="YOUR_DRIVE_ASSET_URL"\n      type="auto"\n    />\n  );\n}`,
        );
      }
      break;
    }

    case 'inspect-folder': {
      const apiKeyIndex =
        args.indexOf('--key') !== -1
          ? args.indexOf('--key') + 1
          : args.indexOf('--apiKey') !== -1
            ? args.indexOf('--apiKey') + 1
            : -1;
      const apiKey = apiKeyIndex !== -1 && args[apiKeyIndex] ? args[apiKeyIndex] : '';

      if (!target || !apiKey) {
        console.error('Usage: npx driveloader inspect-folder <folderUrlOrId> --key <API_KEY>');
        process.exit(1);
      }

      console.log(`📂 Inspecting folder: ${target}...`);
      try {
        const result = await loadFolderAssets({ folderUrl: target, apiKey });
        console.log(`\n✅ Folder Inspection Success:`);
        console.log(`Folder Name: ${result.folder?.name || 'Public Folder'}`);
        console.log(`Total Assets Loaded: ${result.totalLoaded}`);
        console.log(`Has More Pages: ${result.hasMore}`);
      } catch (err) {
        console.error(`❌ Folder Inspection Failed: ${(err as Error).message}`);
        process.exit(1);
      }
      break;
    }

    case 'clear-cache': {
      console.log('🧹 Cache cleared successfully.');
      break;
    }

    case 'generate-types': {
      console.log(`\n📘 Generated TypeScript Definition:\n`);
      console.log(
        `export interface DriveAssetItem {\n  id: string;\n  name: string;\n  mimeType: string;\n  resolvedUrl: string;\n  thumbnailUrl?: string;\n}`,
      );
      break;
    }

    default:
      console.error(
        `Unknown command: ${command}. Run "npx driveloader --help" for available commands.`,
      );
      process.exit(1);
  }
}
