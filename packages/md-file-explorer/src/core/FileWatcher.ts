import chokidar from 'chokidar';
import { FileSystemExplorer } from '../core/FileSystemExplorer';
import { ExplorerOptions, FileWatcherCallback } from '../types';
import { shouldExcludePath } from '../utils/fileUtils';

export class FileWatcher {
  private watcher?: chokidar.FSWatcher;
  private explorer: FileSystemExplorer;
  private isWatching: boolean = false;

  constructor(rootPath: string, options: Partial<ExplorerOptions> = {}) {
    this.explorer = new FileSystemExplorer(rootPath, options);
  }

  /**
   * Start watching the directory for changes
   */
  watch(callback: FileWatcherCallback): void {
    if (this.isWatching) {
      this.stopWatching();
    }

    this.watcher = chokidar.watch(this.explorer.rootPath, {
      ignored: (path: string) => {
        const relativePath = path.replace(this.explorer.rootPath, '');
        return shouldExcludePath(relativePath, this.explorer.options.excludePatterns);
      },
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('add', (path: string) => callback('add', path))
      .on('change', (path: string) => callback('change', path))
      .on('unlink', (path: string) => callback('unlink', path))
      .on('addDir', (path: string) => callback('addDir', path))
      .on('unlinkDir', (path: string) => callback('unlinkDir', path))
      .on('error', (error: Error) => console.error('File watcher error:', error));

    this.isWatching = true;
  }

  /**
   * Stop watching the directory
   */
  stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = undefined;
    }
    this.isWatching = false;
  }

  /**
   * Check if currently watching
   */
  get watching(): boolean {
    return this.isWatching;
  }
}
