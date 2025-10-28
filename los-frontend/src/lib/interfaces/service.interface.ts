export interface IServiceFormValues {
  serviceName: string;
  departmentId: string;
  description: string;
  frequency: string;
  startDate: string;
  dueAfter: string;
}


export interface AddServiceV2Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  editService?: any;
  showTrigger?: boolean;
}
