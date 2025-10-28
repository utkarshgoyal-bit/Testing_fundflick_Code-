import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import apiCaller from '@/helpers/apiHelper';
import { GET_CUSTOMER_PHOTOS_DATA } from '@/redux/actions/types';
import { setPhotosAddFormDialog } from '@/redux/slices/files/photos';
import { RootState } from '@/redux/store';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PhotoForm, { photoFormType } from './form';
import { useNavigate } from 'react-router-dom';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { calculatePhotosProgress } from "@/utils/progress";
import ProgressBar from '../progressBar';

const photoGroups = [
  { photoGroup: 'kyc', title: 'KYC' },
  { photoGroup: 'income', title: 'Income' },
  { photoGroup: 'liability', title: 'Liability' },
  { photoGroup: 'collateral', title: 'Collateral' },
  { photoGroup: 'banking', title: 'Banking' },
  { photoGroup: 'other', title: 'Other' },
];

const PhotoGroup = ({ heading, photoGroup }: { heading: string; photoGroup: string }) => {
  const [open, setOpen] = useState(false);
  const { photos, photosAddFormDialog } = useSelector((state: RootState) => state.filePhotos);
  const dispatch = useDispatch();
  async function handlePdfDownload(url: string) {
    const response = await apiCaller<string>('/signed-url', 'POST', { url });
    if (response && 'data' in response) {
      const link = document.createElement('a');
      link.href = response.data || '';
      link.download = 'file.pdf';
      link.click();
    }
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="my-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200 rounded-t-lg gap-4">
          <h2 className="font-semibold text-lg text-gray-700 max-md:text-sm">{heading}</h2>
          <div className="flex items-center gap-2">
            <Dialog
              open={photosAddFormDialog[photoGroup]}
              onOpenChange={() =>
                dispatch(
                  setPhotosAddFormDialog({
                    [photoGroup]: !photosAddFormDialog[photoGroup],
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
            <Button
              variant="outline"
              size={'sm'}
              onClick={() => setOpen(!open)}
              className="text-sm bg-gray-100 hover:bg-gray-200"
              >
              {open ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </div>
        <Collapsible.Content className="px-6 py-4">
          <div className="p-4 grid grid-cols-2 max-md:grid-cols-1 gap-3 bg-gray-50 rounded-md border border-gray-200">
            {photos?.photos?.map(
              (item: photoFormType, index: number) =>
                item.photoGroup === photoGroup && (
                  <div key={index} className="flex flex-col gap-3">
                    {item.photo?.endsWith('.pdf') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePdfDownload(item.photo)}
                        className="h-[200px]"
                        >
                        <FileText className="text-[100px]" size={100} />
                      </Button>
                    )}
                    {!item.photo?.endsWith('.pdf') && <img src={item.photo} alt="pdf" />}
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                    </div>
                  </div>
                )
            )}
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
};

export default function PhotosStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { photos } = useSelector((state: RootState) => state.filePhotos);
  const progress = calculatePhotosProgress(photos);

  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_PHOTOS_DATA });
  }, []);
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Documents Groups</h1>
       <ProgressBar
                    label="Photos Upload Progress"
                    percentage={progress}
                  />
      {photoGroups.map((item, index) => (
        <PhotoGroup key={index} heading={item.title} photoGroup={item.photoGroup} />
      ))}

      <Button onClick={() => navigate(buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT))} className="float-right">
        Submit Report
      </Button>
    </div>
  );
}
