"use client"

import { Toaster as Sonner } from "sonner"
import {useTheme} from "@/components/providers/theme/use-theme.tsx";

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const theme = useTheme();

    return (
        <Sonner
            theme={theme.getTheme() as ToasterProps["theme"]}
            className="toaster group"
            {...props}
        />
    )
}

export { Toaster }
