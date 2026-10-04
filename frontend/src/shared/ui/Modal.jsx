import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { IconButton } from "./IconButton.jsx";
import React from "react";

export function Modal({ title, description, onClose, children }) {
  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="g-dialog-overlay" />
        <Dialog.Content className="g-dialog">
          <div className="g-dialog-head">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>
                {description || "Điền thông tin và kiểm tra trước khi lưu."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <IconButton icon={X} label="Đóng cửa sổ" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
