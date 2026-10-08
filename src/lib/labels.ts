import productDesign from '@tabler/icons/outline/layout-dashboard.svg?raw';
import designSystems from '@tabler/icons/outline/components.svg?raw';
import designVision from '@tabler/icons/outline/telescope.svg?raw';
import research from '@tabler/icons/outline/user-search.svg?raw';
import prototyping from '@tabler/icons/outline/hand-click.svg?raw';
import type { LabelName } from './label-names';

/** Tabler icon (outline, MIT) for each expertise label. Other icons: https://tabler.io/icons, file name under @tabler/icons/outline/. */
export const LABEL_ICONS: Record<LabelName, string> = {
  'Product Design': productDesign,
  'Design Systems': designSystems,
  'Design Vision': designVision,
  Research: research,
  Prototyping: prototyping,
};

/** The SVG markup with its fixed size removed, so CSS sizes it (the icon is decorative). */
export function labelIcon(name: string): string {
  const svg = LABEL_ICONS[name as LabelName] ?? '';
  return svg.replace(/\s(width|height|class)="[^"]*"/g, '').replace('<svg', '<svg aria-hidden="true" focusable="false"');
}
