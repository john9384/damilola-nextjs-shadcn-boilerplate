"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TableContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function TableContainer({ children, header, footer, className }: TableContainerProps) {
  return (
    <Card className={cn("bg-white flex flex-col min-h-[600px] max-h-full", className)}>
      {header && <CardHeader className="shrink-0">{header}</CardHeader>}
      <CardContent className="overflow-y-auto flex-1 flex flex-col min-h-0">{children}</CardContent>
      {footer && <CardFooter className="shrink-0">{footer}</CardFooter>}
    </Card>
  );
}

