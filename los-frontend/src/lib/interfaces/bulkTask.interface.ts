export interface ICreateBulkTask {
    data: {
        departmentId: string;
        serviceId: string;
        users: string[];
        description: string;
        repeat: string;
        startDate: number;
        dueAfterDays: string;
        priorityOfTask: string;
    };
    loading: boolean;
    error: any;
}
