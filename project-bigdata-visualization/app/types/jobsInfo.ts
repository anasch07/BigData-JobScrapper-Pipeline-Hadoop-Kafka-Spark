export type JobsInfo = {
    maxSalary: number;
    minSalary: number;
    totalJobs: number;
    totalCompanies: number;
    medianSalary: medianSalary[];
}

export type medianSalary = {
    date: string;
    medianMinSalary: number;
    medianMaxSalary: number;
}
