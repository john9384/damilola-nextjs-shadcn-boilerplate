import { useQuery } from "@tanstack/react-query";
import {
  remittanceService,
  type PaginatedRemittances,
  type RemittanceFilters,
  type RemittanceRecord,
} from "@/services/remittance-service";

export function useRemittances(filters: RemittanceFilters) {
  return useQuery<PaginatedRemittances>({
    queryKey: ["remittance", filters],
    queryFn: () => remittanceService.listRemittances(filters),
  });
}

export function useRemittance(id?: string) {
  return useQuery<RemittanceRecord>({
    queryKey: ["remittance", "details", id],
    queryFn: () => remittanceService.getRemittanceById(id as string),
    enabled: Boolean(id),
  });
}
