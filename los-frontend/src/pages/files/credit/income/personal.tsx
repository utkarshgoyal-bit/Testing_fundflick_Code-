import { Card, CardContent } from '@/components/ui/card';
export default function PersonalDetailsCard({ data }: { data: any }) {
  const detailFields = [
    ['First Name', data?.firstName],
    ['Middle Name', data?.middleName],
    ['Last Name', data?.lastName],
    ['Date Of Birth', data?.dob],
    ['Gender', data?.gender],
    ['Phone', data?.phone],
    ['Alternate Phone', data?.altphone],
    ['Email', data?.email],
    ['Aadhaar Number', data?.aadhaarNumber],
    ['Personal Pan', data?.personalPan],
    ['Voter Id', data?.voterId],
    ['Other Id', data?.otherId],
    ['Nationality', data?.nationality],
    ['Religion', data?.religion],
    ['Education', data?.education],
    ['Marital Status', data?.maritalStatus],
  ];

  return (
    <div className="relative w-full">
      {/* <Dialog>
        <DialogTrigger className="absolute right-3 top-3">
          <Pencil />
        </DialogTrigger>
        <DialogContent className="w-full max-w-[100vw]  md:max-w-[60vw] lg:max-w-[75vw] xl:max-w-[50vw] max-h-[90vh]  overflow-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <CustomerDetails />
        </DialogContent>
      </Dialog> */}
      <Card className="p-4">
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4 flex justify-center items-start">
            <img src={data?.uidFront} alt="Aadhaar" className="w-full h-auto rounded" />
          </div>
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {detailFields.map(([label, value]) => (
              <div key={label}>
                <span className="text-gray-500">{label}</span>
                <br />
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
