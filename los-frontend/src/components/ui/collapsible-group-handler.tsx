import { useState } from "react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"


export default function CollapsibleGroupHandler({ title, children, className, contentClassName, rightSideElement }: {
    title: string
    children: React.ReactNode,
    className?: string;
    contentClassName?: string;
    rightSideElement?: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    return (
        <Collapsible className="focus:border-2 focus:border-red-300 transition-all duration-300 ease-in"  open={open}>
            <CollapsibleTrigger
                className={cn("w-full flex justify-between  bg-primary rounded-md text-white p-2 px-4  items-center ", className)}>
                {title}
                <div>
                    {rightSideElement}
                    <span onClick={() => setOpen(!open)} className="font-light text-3xl ml-4">{open ? "-" : "+"}</span>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("border p-5 m-3 transition-all duration-300 max-h-fit overflow-auto ", contentClassName)}>
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}
