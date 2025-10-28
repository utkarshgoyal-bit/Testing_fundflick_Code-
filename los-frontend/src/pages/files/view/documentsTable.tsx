import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Dot,
  Download,
  Eye,
  // PencilLine, Trash2
} from 'lucide-react';

export default function DocumentTable({ customer }: { customer: any }) {
  const columns = [
    { accessorKey: 'DocumentName', header: 'Documents' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'about', header: 'About' },
    { accessorKey: 'actions', header: '' },
  ];

  const data = [
    {
      id: 'kyc',
      DocumentName: 'KYC',
      status: 'Uploaded',
      about: 'KYC Details',
    },
    {
      id: 'income',
      DocumentName: 'Income',
      status: 'Uploaded',
      about: 'Income Details',
    },
    {
      id: 'liability',
      DocumentName: 'Liability',
      status: 'Uploaded',
      about: 'Liability Details',
    },
    {
      id: 'collateral',
      DocumentName: 'Collateral',
      status: 'Uploaded',
      about: 'Collateral Details',
    },
    {
      id: 'banking',
      DocumentName: 'Banking',
      status: 'Uploaded',
      about: 'Banking Details',
    },
    {
      id: 'other',
      DocumentName: 'Other',
      status: 'Uploaded',
      about: 'Other Details',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full border-collapse border border-gray-100">
        <thead>
          <tr className="bg-[#F9FAFB] text-left h-[44px] px-3">
            {columns.map((col) => (
              <th className="text-[12px] font-medium leading-5 text-left px-4 py-2" key={col.accessorKey}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className=" hover:bg-gray-50">
              <td className="px-4 py-5 border-t border-gray-300 text-[14px] w-[40%] sticky left-0 bg-white shadow-md z-10">
                {row.DocumentName}
              </td>
              <td className="px-4 py-5 border-t border-gray-300 text-[14px] w-[25%]">
                <span className="px-2 flex justify-center items-center gap-2 border rounded-lg w-fit py-1 text-[12px]">
                  <Dot size={8} className="bg-green-400 text-green-400 rounded-full" />
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-5 border-t border-gray-300 text-[14px] w-[25%]">{row.about}</td>
              <td className="px-4 py-5 border-t border-gray-300 text-[14px] w-[10%]">
                <div className="flex gap-4 justify-center">
                  <Dialog>
                    <DialogTrigger>
                      <Eye className="cursor-pointer hover:text-gray-700" size={20} />
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-[90vw] max-md:w-[100vw] max-md:max-w-[100vw] max-h-[90vh] h-[90vh] flex flex-col overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Photos</DialogTitle>
                        <DialogDescription>{row.DocumentName} photos</DialogDescription>
                      </DialogHeader>
                      <Photos documents={row.id} customer={customer} />
                    </DialogContent>
                  </Dialog>
                  {/* <PencilLine
                    className="cursor-pointer hover:text-gray-700"
                    size={20}
                  /> */}
                  {/* <Download
                    className="cursor-pointer hover:text-gray-700"
                    size={20}
                  /> */}
                  {/* <Trash2
                    className="cursor-pointer hover:text-gray-700"
                    size={20}
                  /> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Photos = ({ documents, customer }: { documents: string; customer: any }) => {
  let photos: { name: string; url: string }[] = [];
  if (documents === 'kyc') {
    photos = [
      {
        name: 'Aadhar Card Front',
        url: customer.uidFront,
        employeeId: `${customer.firstName ?? ''} ${customer.middleName ?? ''} ${customer.lastName ?? ''}`,
      },
      {
        name: 'Aadhar Card Back',
        url: customer.uidBack,
        employeeId: `${customer.firstName ?? ''} ${customer.middleName ?? ''} ${customer.lastName ?? ''}`,
      },
      ...customer.customerOtherFamilyDetails.map((item: any) => ({
        name: 'Aadhar Card Front',
        url: item.uidFront,
        employeeId: `${item.firstName ?? ''} ${item.middleName ?? ''} ${item.lastName ?? ''}`,
      })),
      ...customer.customerOtherFamilyDetails.map((item: any) => ({
        name: 'Aadhar Card Back',
        url: item.uidBack,
        employeeId: `${item.firstName ?? ''} ${item.middleName ?? ''} ${item.lastName ?? ''}`,
      })),
      ...customer.photos
        .filter((item: any) => item.photoGroup === documents)
        .map((item: any) => ({
          name: item.title,
          url: item.photo,
          employeeId: item.title,
        })),
    ];
  } else {
    photos = [
      ...customer.photos
        .filter((item: any) => item.photoGroup === documents)
        .map((item: any) => ({
          name: item.title,
          url: item.photo,
        })),
    ];
  }

  // Function to handle file downloads
  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
      {photos.map((item: any, index: number) => (
        <div key={index} className="relative min-h-[200px]">
          {/* Image or PDF Display */}
          {!item?.url?.endsWith('.pdf') ? (
            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition">
              <img src={item.url} alt={item.employeeId} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition">
              <img src="/pdf.png" alt={item.employeeId} className="w-full h-full object-cover" />
            </div>
          )}

          {/* File Name */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2">
            <p className="truncate" title={item.name}>
              {item.name}
            </p>
          </div>

          {/* Download Button */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => handleDownload(item.url, item.name)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 focus:outline-none"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
