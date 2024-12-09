/**
 * @file Provides a floating toolbar component for controlling LiteGraph workflow
 * execution.
 */
import { useState, useEffect, useRef } from "react";
import { GripVertical, Settings, Repeat2 } from "lucide-react";
import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SettingsDialog } from "@/components/FloatingToolbar/SettingsDialog/SettingsDialog";

/**
 * Floating toolbar component for controlling LiteGraph workflow execution.
 */
export const FloatingToolbar = () => {
  const nodeRef = useRef(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPositionLoaded, setIsPositionLoaded] = useState(false);

  useEffect(() => {
    // Retrieve the saved position from localStorage.
    const savedPosition = localStorage.getItem("floatingToolbarPosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
    setIsPositionLoaded(true);
  }, []);

  /** Starts workflow execution. */
  const handlePlay = () => {
    setIsExecuting(true);
  };

  /** Stops workflow execution. */
  const handleStop = () => {
    setIsExecuting(false);
  };

  /** Toggles continuous execution mode. */
  const toggleRecurring = () => {
    setIsRecurring((prev) => !prev);
  };

  /**
   * Ensures the toolbar position is saved when dragged.
   * @param e - The drag event.
   * @param data - The drag data.
   */
  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem(
      "floatingToolbarPosition",
      JSON.stringify(newPosition)
    );
  };

  // Wait for position to be loaded before rendering.
  if (!isPositionLoaded) {
    return null;
  }

  return (
    <Draggable handle=".drag-handle" position={position} onStop={handleDrag} nodeRef={nodeRef}>
      <div ref={nodeRef} className="fixed bottom-5 left-0 right-0 flex justify-center z-50">
        <Card className="flex items-center space-x-2 p-2">
          {/* Draggable Handle */}
          <div className="drag-handle cursor-move flex items-center">
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Play Button */}
          <Button
            variant="outline"
            onClick={handlePlay}
            aria-label="Play"
            className={`${isExecuting ? "bg-green-500 text-white" : ""}`}
            disabled={isExecuting}
            style={{
              opacity: isExecuting ? 1 : undefined,
              cursor: isExecuting ? "not-allowed" : undefined,
            }}
          >
            <PlayIcon className="w-5 h-5" />
          </Button>
          {/* Recurring Button */}
          <Button
            variant="outline"
            onClick={toggleRecurring}
            aria-label="Toggle Recurring"
            className={isRecurring ? "text-green-500 hover:text-green-500" : ""}
          >
            <Repeat2 className="w-5 h-5" />
          </Button>
          {/* Stop Button */}
          <Button
            variant="outline"
            onClick={handleStop}
            aria-label="Stop"
            className={isExecuting ? "text-red-500 hover:text-red-500" : ""}
          >
            <StopIcon className="w-5 h-5" />
          </Button>
          {/* Settings Dialog Button */}
          <SettingsDialog
            trigger={
              <Button variant="outline" aria-label="Settings">
                <Settings className="w-5 h-5" />
              </Button>
            }
          />
        </Card>
      </div>
    </Draggable>
  );
};

export default FloatingToolbar;
