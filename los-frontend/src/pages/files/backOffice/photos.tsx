import { Button } from '@/components/ui/button';
import CollapsibleGroupHandler from '@/components/ui/collapsible-group-handler';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RootState } from '@/redux/store';
import {
  ADD_CUSTOMER_PHOTOS_DATA,
  EDIT_CUSTOMER_ASSOCIATES_DATA,
  EDIT_CUSTOMER_DETAILS_DATA,
  GET_CUSTOMER_PHOTOS_DATA,
} from '@/redux/actions/types';
import { setPhotosAddFormDialog } from '@/redux/slices/files/photos';
import { Eye, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PhotoForm from '@/pages/files/steps/photos/form';
import { calculateOverallProgress } from '@/utils/progress';
import ProgressBar from './progressbar';

export default function Photos() {
  const dispatch = useDispatch();
  const { photos } = useSelector((state: RootState) => state.filePhotos);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const overallPercent = calculateOverallProgress(photos);
  const photoGroups = [
    { photoGroup: 'income', title: 'Income' },
    { photoGroup: 'liability', title: 'Liability' },
    { photoGroup: 'collateral', title: 'Collateral' },
    { photoGroup: 'banking', title: 'Banking' },
    { photoGroup: 'other', title: 'Other' },
  ];

  const handleOpen = (url: string) => {
    setSelectedImg(url);
    setOpen(true);
  };

  const renderTableRows = (rows: any[], photoGroup?: string) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    function handleFileUpload(
      row: {
        title: string;
        photoGroup: string;
        section: string;
        key: string;
        aadhaarNumber: string;
      },
      file: any
    ) {
      if (row.section === 'customer' && file) {
        dispatch({
          type: EDIT_CUSTOMER_DETAILS_DATA,
          payload: {
            customerDetails: { ...photos.customerDetails, [row.key]: file },
          },
        });
      } else if (row.section == 'family' && file) {
        const data = photos.customerOtherFamilyDetails.find((item: any) => {
          return item.customerDetails.aadhaarNumber === row.aadhaarNumber;
        });
        const { createdBy, _id, __v, updatedAt, updatedBy, createdAt, ...payload } = data;
        dispatch({
          type: EDIT_CUSTOMER_ASSOCIATES_DATA,
          payload: {
            associate: {
              ...payload,
              customerDetails: { ...payload.customerDetails, [row.key]: file },
            },
            associate_id: data._id,
          },
        });
      } else {
        file &&
          dispatch({
            type: ADD_CUSTOMER_PHOTOS_DATA,
            payload: { ...row, photo: file, customer_id: photos?._id },
          });
      }
    }
    return rows
      ?.filter((item) => !photoGroup || item.photoGroup === photoGroup)
      ?.map((row: any, index: number) => {
        return (
          <tr className="bg-white border-b border-slate-200" key={`${photoGroup || 'row'}-${index}`}>
            <td className="border-slate-600 px-4 py-2">{row.title}</td>
            <td className="border-slate-600 px-4 py-2">
              <Button onClick={() => handleOpen(row.photo)}>
                <Eye />
              </Button>
            </td>
            <td className="border-slate-600 px-4 py-2">
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="file"
                hidden
                onChange={(e) => {
                  e.target.files && handleFileUpload(row, e.target.files[0]);
                }}
              />
              <Button onClick={() => inputRefs.current[index]?.click()}>
                <Upload />
              </Button>
            </td>
          </tr>
        );
      });
  };

  const renderKycRows = () => {
    const mainRows = [
      {
        title: `${photos?.customerDetails?.firstName || ''} ${photos?.customerDetails?.middleName || ''} ${photos?.customerDetails?.lastName || ''} (UID Front)`,
        photo: photos?.customerDetails?.uidFront,
        section: 'customer',
        key: 'uidFront',
      },
      {
        title: `${photos?.customerDetails?.firstName || ''} ${photos?.customerDetails?.middleName || ''} ${photos?.customerDetails?.lastName || ''} (UID Back)`,
        photo: photos?.customerDetails?.uidBack,
        section: 'customer',
        key: 'uidBack',
      },
    ];

    const familyRows = photos?.customerOtherFamilyDetails?.flatMap((person: any) => [
      {
        title: `${person?.customerDetails?.firstName || ''} ${person?.customerDetails?.middleName || ''} ${person?.customerDetails?.lastName || ''} (${person?.relation}) (UID Front)`,
        photo: person?.customerDetails?.uidFront,
        section: 'family',
        key: 'uidFront',
        aadhaarNumber: person?.customerDetails?.aadhaarNumber,
      },
      {
        title: `${person?.customerDetails?.firstName || ''} ${person?.customerDetails?.middleName || ''} ${person?.customerDetails?.lastName || ''} (${person?.relation}) (UID Back)`,
        photo: person?.customerDetails?.uidBack,
        section: 'family',
        key: 'uidBack',
        aadhaarNumber: person?.customerDetails?.aadhaarNumber,
      },
    ]);

    const kycRows = photos?.photos?.filter((photo: any) => photo.photoGroup === 'kyc') || [];

    return renderTableRows([...(mainRows || []), ...(familyRows || []), ...(kycRows || [])]);
  };
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_PHOTOS_DATA });
  }, []);
  return (
    <div className="space-y-2">
      <ProgressBar label="Overall Progress" percentage={overallPercent} />
      <CollapsibleGroupHandler
        title="KYC"
        className="bg-light-primary-background text-black"
        contentClassName="p-0"
        rightSideElement={<AddPhoto photoGroup="kyc" />}
      >
        <table className="table-auto border-collapse border-slate-500 w-full">
          <thead>
            <tr className="bg-slate-200">
              <th className="border-slate-600 px-4 py-2 text-left">Title</th>
              <th className="border-slate-600 px-4 py-2 text-left">View</th>
              <th className="border-slate-600 px-4 py-2 text-left">Upload</th>
            </tr>
          </thead>
          <tbody>{renderKycRows()}</tbody>
        </table>
      </CollapsibleGroupHandler>

      {photoGroups.map((group, index) => (
        <CollapsibleGroupHandler
          key={`photoGroup-${index}`}
          title={group.title}
          className="bg-light-primary-background text-black"
          contentClassName="p-0"
          rightSideElement={<AddPhoto photoGroup={group.photoGroup} />}
        >
          <table className="table-auto border-collapse border-slate-500 w-full">
            <thead>
              <tr className="bg-slate-200">
                <th className="border-slate-600 px-4 py-2 text-left">Title</th>
                <th className="border-slate-600 px-4 py-2 text-left">View</th>
                <th className="border-slate-600 px-4 py-2 text-left">Upload</th>
              </tr>
            </thead>
            <tbody>{renderTableRows(photos?.photos || [], group.photoGroup)}</tbody>
          </table>
        </CollapsibleGroupHandler>
      ))}

      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="max-w-[50vw] max-md:max-w-[90vw] max-h-[50vw] max-md:max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>View Photos</DialogTitle>
            <DialogDescription />
            <div>
              <img src={selectedImg} className="w-[50vw] h-[80vh]" alt="Selected" />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddPhoto({ photoGroup }: { photoGroup: string }) {
  const PhotoGroupDialogAdd = useSelector((state: RootState) => state.filePhotos).photosAddFormDialog;
  const dispatch = useDispatch();
  return (
    <Dialog
      open={PhotoGroupDialogAdd[photoGroup]}
      onOpenChange={() =>
        dispatch(
          setPhotosAddFormDialog({
            [photoGroup]: !PhotoGroupDialogAdd[photoGroup],
          })
        )
      }
    >
      <DialogTrigger>
        <Button
          variant="outline"
          size={'sm'}
          className="text-sm bg-secondary max-md:text-sm text-white hover:bg-primary hover:text-white"
        >
          Add Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-primary max-md:text-sm">Add New Photo {photoGroup}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <PhotoForm defaultValue={{ photoGroup }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
