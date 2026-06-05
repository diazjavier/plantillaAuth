"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { ConfirmDialogProps } from "@/interfaces/generics";

interface GenericConfigDialogProps {
  confirmdialog: ConfirmDialogProps;
  open: boolean;
}

export default function ConfirmDialog({ confirmdialog, open }: GenericConfigDialogProps) {

  const {
    //isOpen,
    onClose,
    title,
    description,
    confirmText,
    cancelText,
    confirmColor,
    onConfirm,
  } = confirmdialog;

  const handleConfirm = async () => {
    await onConfirm(); // Ejecuta la acción pasada por parámetro (soporta async)
    onClose(); // Cierra el modal automáticamente
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Content
        maxWidth="450px"
        className="!bg-[#042a57] !text-white border border-slate-700"
      >
        <AlertDialog.Title className="text-lg font-bold">
          {title}
        </AlertDialog.Title>

        <AlertDialog.Description size="2" className="mt-2 text-slate-300">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="surface"
              color="gray"
              onClick={onClose}
              className="cursor-pointer"
            >
              {cancelText}
            </Button>
          </AlertDialog.Cancel>

          <AlertDialog.Action>
            <Button
              variant="solid"
              color={confirmColor}
              onClick={handleConfirm}
              className="cursor-pointer"
            >
              {confirmText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
