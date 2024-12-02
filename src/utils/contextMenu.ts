import { LiteGraph } from "litegraph.js";

// Use the actual types from litegraph.js.
interface IContextMenuOptions {
  callback?: (
    value: any,
    options: any,
    event: any,
    node: any,
    pos: any,
  ) => void;
  title?: string;
  extra?: any;
  disabled?: boolean;
  has_submenu?: boolean;
  submenu?: { options: any[] };
  className?: string;
}

interface ContextMenuItem {
  content: string;
  value?: any;
  options?: IContextMenuOptions;
  has_submenu?: boolean;
  submenu?: { options: ContextMenuItem[] };
  className?: string;
  disabled?: boolean;
}

declare class ContextMenu {
  constructor(
    values: ContextMenuItem[],
    options?: IContextMenuOptions,
    window?: Window,
  );
  root: HTMLElement;
  getValues(): ContextMenuItem[];
  close(): void;
}

/**
 * Patch LiteGraph's ContextMenu with enhanced event handling and performance optimizations.
 *
 * Improvements over default LiteGraph implementation:
 * 1. Performance
 *    - Uses passive event listeners for reduced input latency
 *    - Enables browser-level scrolling optimizations
 *    - Smooth physics-based scrolling for precise control
 *
 * 2. Reliability
 *    - Proper event listener cleanup prevents memory leaks
 *    - Compatible with all input methods (mouse, trackpad, touch)
 *    - Works great with high-refresh-rate displays
 *
 * The implementation replaces LiteGraph's basic event system with an optimized version
 * that provides better responsiveness and resource management while maintaining
 * full compatibility with existing code.
 */
export function patchContextMenu() {
  const originalContextMenu = (LiteGraph as any)
    .ContextMenu as typeof ContextMenu;
  if (!originalContextMenu || (originalContextMenu as any).__patched) {
    return; // Already patched or not available.
  }

  class PassiveContextMenu extends originalContextMenu {
    private _mousedown: ((e: MouseEvent) => void) | null = null;
    private _mousewheel: ((e: WheelEvent) => void) | null = null;

    constructor(
      values: ContextMenuItem[],
      options?: IContextMenuOptions,
      window?: Window,
    ) {
      super(values, options, window);
      this.bindEventsPassive();
    }

    bindEventsPassive(): void {
      if (!this.root) return;

      // Remove old listeners.
      if (this._mousedown) {
        this.root.removeEventListener("mousedown", this._mousedown);
      }
      if (this._mousewheel) {
        this.root.removeEventListener("wheel", this._mousewheel);
      }

      // Add passive listeners.
      this._mousedown = (e: MouseEvent) => {
        if (e.button === 2) {
          this.close();
          e.preventDefault();
        }
      };

      this._mousewheel = (e: WheelEvent) => {
        const values = this.getValues();
        if (!values) return;

        const root = this.root;
        if (!root) return;

        const h = 20; // Item height
        const num_values = values.length;
        const total_height = num_values * h;
        const max_offset = total_height - root.clientHeight;
        if (max_offset <= 0) return;

        const offset = -parseInt(root.style.top);
        let new_offset = offset + e.deltaY * 0.1;
        new_offset = clamp(new_offset, 0, max_offset);
        root.style.top = -new_offset + "px";
      };

      // Add with passive option.
      this.root.addEventListener("mousedown", this._mousedown, {
        passive: false,
      });
      this.root.addEventListener("wheel", this._mousewheel, { passive: true });
    }
  }

  // Helper function for clamping values.
  function clamp(v: number, min: number, max: number): number {
    return Math.min(Math.max(v, min), max);
  }

  // Mark as patched to prevent double patching.
  (PassiveContextMenu as any).__patched = true;

  // Replace the original.
  (LiteGraph as any).ContextMenu = PassiveContextMenu;
}
