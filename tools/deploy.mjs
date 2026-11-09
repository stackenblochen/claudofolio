// Upload release/ to hallo-wl.de over FTP. Usage (see package.json): npm run deploy [-- --dry-run] [-- --backup-old-index]
//
// Settings come from .env (git-ignored), never from the repo:
//   FTP_HOST      host name of the FTP server
//   FTP_USER      user name
//   FTP_PASSWORD  password
//   FTP_DIR       the web root on the server, e.g. / or /httpdocs (default /)
//   FTP_SECURE    true (default, explicit FTPS) | false (plain FTP) | implicit
//   FTP_PORT      optional
//   FTP_INSECURE_TLS  true only if your host's TLS certificate does not match the host name (still encrypted, but not verified)
//
// What it does: uploads everything in release/ (index.html, portfolio/ with its dotfiles) and overwrites files of the same name.
// What it never does: delete anything on the server. The one file it could replace that is not ours is the old top-level index.html:
// it stops unless that file is already ours or you pass --backup-old-index (which renames it to index-old.html first).
import { Client } from 'basic-ftp';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, posix, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const local = join(root, 'release');
const args = new Set(process.argv.slice(2));
const dry = args.has('--dry-run');
const backupOld = args.has('--backup-old-index');
const OUR_MARK = 'Continue to the portfolio'; // text of tools/release-index.html

const need = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'].filter((k) => !process.env[k]);
if (need.length) fail(`Missing in .env: ${need.join(', ')} (see .env.example).`);
if (!existsSync(join(local, 'index.html')) || !existsSync(join(local, 'portfolio', 'index.html'))) {
  fail('release/ is missing or incomplete. Run: npm run build:release');
}

const files = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? files(p) : [p];
});
const all = files(local).filter((p) => !p.endsWith('.DS_Store'));
const remoteDir = process.env.FTP_DIR || '/';
const secureRaw = (process.env.FTP_SECURE ?? 'true').toLowerCase();
const secure = secureRaw === 'implicit' ? 'implicit' : secureRaw !== 'false';

const client = new Client(30000);
try {
  await client.access({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT ? Number(process.env.FTP_PORT) : undefined,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure,
    secureOptions: { rejectUnauthorized: process.env.FTP_INSECURE_TLS !== 'true' },
  });
  if (!secure) console.log('Note: plain FTP, the password is sent unencrypted. Use FTP_SECURE=true if your host supports FTPS.');
  await client.ensureDir(remoteDir);
  await client.cd(remoteDir);
  const here = await client.list();

  // the top-level index.html on the server: ours, absent, or the old site
  let oldIndex = false;
  if (here.some((f) => f.name === 'index.html')) {
    const chunks = [];
    const { Writable } = await import('node:stream');
    await client.downloadTo(new Writable({ write(c, _e, cb) { chunks.push(c); cb(); } }), 'index.html');
    oldIndex = !Buffer.concat(chunks).toString('utf8').includes(OUR_MARK);
  }
  if (oldIndex && !backupOld) {
    fail(`The server's index.html is not the forwarder of this site, so I stopped before replacing it.\nRun with --backup-old-index to rename it to index-old.html first (nothing is deleted).`);
  }
  if (oldIndex && here.some((f) => f.name === 'index-old.html')) {
    fail('index-old.html already exists on the server; I will not overwrite it. Rename or move it first.');
  }

  console.log(`${dry ? 'DRY RUN, nothing is changed. ' : ''}Target: ${process.env.FTP_HOST}${remoteDir}`);
  if (oldIndex) console.log(`${dry ? 'Would rename' : 'Renaming'} index.html -> index-old.html`);
  console.log(`${dry ? 'Would upload' : 'Uploading'} ${all.length} files from release/ (nothing on the server is deleted).`);
  if (dry) {
    for (const p of all.slice(0, 15)) console.log('  ' + relative(local, p));
    if (all.length > 15) console.log(`  … and ${all.length - 15} more`);
  } else {
    if (oldIndex) await client.rename('index.html', 'index-old.html');
    await upload();
    console.log('Done. Check: the home page, a protected case study, and a nonexistent address under /portfolio/ (404 page).');
  }
} catch (e) {
  fail(`FTP error: ${e.message}`);
} finally {
  client.close();
}

// Uploads file by file (same result as uploadFromDir, overwriting files of the same name) so there is a progress line:
// percent of all bytes, files done, MB, speed and the file in flight. In a terminal it updates in place; in a log it prints a line every 5 %.
async function upload() {
  const sizes = all.map((p) => statSync(p).size);
  const total = sizes.reduce((a, b) => a + b, 0) || 1;
  const mb = (n) => (n / 1048576).toFixed(1);
  const tty = process.stdout.isTTY;
  const t0 = Date.now();
  let done = 0, inFile = 0, count = 0, lastBucket = -1, current = '';
  const line = () => {
    const bytes = done + inFile, pct = Math.min(100, Math.floor((bytes / total) * 100));
    const secs = (Date.now() - t0) / 1000, speed = secs > 0 ? bytes / secs : 0;
    const eta = speed > 0 ? Math.max(0, Math.round((total - bytes) / speed)) : 0;
    const bar = '#'.repeat(Math.floor(pct / 4)).padEnd(25, '.');
    return `[${bar}] ${String(pct).padStart(3)}%  ${count}/${all.length} files  ${mb(bytes)}/${mb(total)} MB  ${mb(speed)} MB/s  ~${eta}s left  ${current}`;
  };
  const show = (force = false) => {
    if (tty) process.stdout.write('\r' + line().slice(0, process.stdout.columns ? process.stdout.columns - 1 : 160).padEnd(process.stdout.columns ? process.stdout.columns - 1 : 0));
    else {
      const bucket = Math.floor(((done + inFile) / total) * 20);
      if (force || bucket !== lastBucket) { lastBucket = bucket; console.log(line()); }
    }
  };
  client.trackProgress((info) => { inFile = info.bytes; if (tty) show(); });
  let remoteHere = null;
  for (let i = 0; i < all.length; i++) {
    const rel = relative(local, all[i]).split(sep).join('/');
    const dir = posix.join(remoteDir, dirname(rel) === '.' ? '' : dirname(rel));
    if (dir !== remoteHere) { await client.ensureDir(dir); remoteHere = dir; }
    current = rel;
    inFile = 0;
    await client.uploadFrom(all[i], basename(rel));
    done += sizes[i]; inFile = 0; count = i + 1;
    show();
  }
  client.trackProgress();
  if (tty) process.stdout.write('\n'); else show(true);
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}
