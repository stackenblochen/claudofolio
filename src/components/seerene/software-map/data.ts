/**
 * Demo repository for the 3D software map: a Hadoop-like code base (open-source project names), generated deterministically from a seed.
 * Every file has a size (lines of code, the area on the map), a complexity (lines of complex code, the height and colour) and a change
 * status against the reference build. CONFIDENTIAL case-study material: this folder is excluded via .git/info/exclude.
 */
export type Status = 'unmodified' | 'improvement' | 'deterioration';
export interface MapNode { name: string; children?: MapNode[]; size?: number; complexity?: number; status?: Status; value?: number }

// structure: [name, children] for a folder, [name, fileCount] for a folder that holds files
type Spec = [string, Spec[] | number];
const SPEC: Spec = ['hadoop', [
  ['hadoop-common-project', [
    ['hadoop-common', [['src', [['fs', 150], ['io', 130], ['ipc', 70], ['security', 120], ['util', 160], ['conf', 25], ['metrics2', 60], ['net', 45], ['crypto', 40]]]]],
    ['hadoop-auth', [['src', [['server', 40], ['client', 20]]]]],
    ['hadoop-kms', [['src', 70]]],
    ['hadoop-minikdc', [['src', 12]]],
  ]],
  ['hadoop-hdfs-project', [
    ['hadoop-hdfs', [['src', [['namenode', 230], ['datanode', 150], ['blockmanagement', 110], ['protocol', 70], ['server', 90], ['tools', 50]]]]],
    ['hadoop-hdfs-client', [['src', [['client', 110], ['protocol', 80], ['web', 25]]]]],
    ['hadoop-hdfs-rbf', [['src', [['router', 120], ['store', 70], ['resolver', 40]]]]],
    ['hadoop-hdfs-httpfs', [['src', 50]]],
  ]],
  ['hadoop-yarn-project', [
    ['hadoop-yarn-server', [['src', [['resourcemanager', 260], ['nodemanager', 190], ['scheduler', 120], ['timeline', 80], ['webapp', 50]]]]],
    ['hadoop-yarn-common', [['src', [['api', 70], ['util', 90], ['security', 40], ['event', 25]]]]],
    ['hadoop-yarn-client', [['src', 70]]],
    ['hadoop-yarn-applications', [['src', [['distributedshell', 25], ['submarine', 140]]]]],
  ]],
  ['hadoop-mapreduce-project', [
    ['hadoop-mapreduce-client', [['src', [['core', 230], ['app', 120], ['jobclient', 80], ['common', 40], ['shuffle', 30]]]]],
    ['hadoop-mapreduce-examples', [['src', 40]]],
  ]],
  ['hadoop-tools', [
    ['hadoop-aws', [['src', 120]]],
    ['hadoop-azure', [['src', 100]]],
    ['hadoop-distcp', [['src', 55]]],
    ['hadoop-streaming', [['src', 35]]],
    ['hadoop-archives', [['src', 14]]],
    ['hadoop-sls', [['src', 45]]],
  ]],
  ['hadoop-hdds', [
    ['server-scm', [['src', 90]]],
    ['container-service', [['src', 90]]],
    ['framework', [['src', 70]]],
  ]],
]];

const WORDS = ['Abstract', 'Default', 'Block', 'File', 'Name', 'Data', 'Node', 'Task', 'Job', 'Container', 'Resource', 'Scheduler', 'Queue', 'Log', 'Aggregation', 'Token', 'Secret', 'Rpc', 'Client', 'Server', 'Lease', 'Storage', 'Policy', 'Metrics', 'Cache', 'Stream', 'Path', 'Config', 'Event', 'Context', 'Record', 'Report', 'Volume', 'Replica', 'Snapshot', 'Quota', 'Proxy', 'Router', 'Zone', 'Key'];
const ROLES = ['Manager', 'Handler', 'Service', 'Impl', 'Factory', 'Util', 'Reader', 'Writer', 'Tracker', 'Monitor', 'Provider', 'Store', 'Controller', 'Builder', 'Checker', 'Allocator', 'Listener', 'Selector'];

function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function generate(seed = 7): MapNode {
  const r = rng(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const gauss = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  const file = (): MapNode => {
    const size = Math.max(8, Math.round(Math.exp(4.6 + gauss() * 1.0)));            // median ~100 lines
    const u = r();
    const complexity = Math.round(size * (0.02 + 0.35 * u * u * u * u) * (0.6 + r() * 0.8)); // mostly low, a long tail of complex files
    const s = r();
    const status: Status = s < 0.62 ? 'unmodified' : s < 0.86 ? 'deterioration' : 'improvement';
    return { name: `${pick(WORDS)}${pick(WORDS)}${pick(ROLES)}.java`, size, complexity, status };
  };
  const build = (spec: Spec): MapNode => {
    const [name, body] = spec;
    if (typeof body === 'number') return { name, children: Array.from({ length: Math.round(body * 1.6) }, file) };
    return { name, children: body.map(build) };
  };
  const root = build(SPEC);
  // a few percent of the files are hot spots (yellow, orange, red on the map)
  const all: MapNode[] = []; const collect = (n: MapNode) => (n.children ? n.children.forEach(collect) : all.push(n)); collect(root);
  for (const f of all) if (r() < 0.02) { const t = r(); f.complexity = Math.round(300 + t * t * t * t * 900); f.size = Math.max(f.size!, Math.round(f.complexity! * (1.05 + r() * 0.4))); }
  // one outlier, like the single tall tower in the original map
  const first = (n: MapNode): MapNode => (n.children ? first(n.children[0]) : n);
  const tower = first(root.children![0].children![0]);
  tower.name = 'TestKMS.java'; tower.size = 700; tower.complexity = 6200; tower.status = 'deterioration';
  return root;
}
