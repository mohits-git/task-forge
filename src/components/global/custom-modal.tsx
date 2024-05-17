'use client';
import { useModal } from "@/providers/modal-provider"
import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";

type Props = {
  title: string
  subheading: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function CustomModal({ title, subheading, children, defaultOpen }: Props) {
  const { isOpen, setClose } = useModal();

  return (
    <Dialog
      open={isOpen || defaultOpen}
      onOpenChange={setClose}
    >
      <DialogContent className="overflow-scroll invisible-scrollbar md:max-h-[700px] md:h-fit h-screen bg-card" >
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
