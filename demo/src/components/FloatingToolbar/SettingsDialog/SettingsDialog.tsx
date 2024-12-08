/**
 * @file Provides the SettingsDialog component for configuring the LiteGraph graph.
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

/** Properties for the SettingsDialog component. */
interface SettingsDialogProps {
  /** Trigger element for the dialog. */
  trigger: ReactNode;
}

/**
 * Settings dialog component for configuring the LiteGraph graph.
 */
export const SettingsDialog = ({ trigger }: SettingsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your settings here.</DialogDescription>
        </DialogHeader>
        {/* Add your settings form or content here */}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
