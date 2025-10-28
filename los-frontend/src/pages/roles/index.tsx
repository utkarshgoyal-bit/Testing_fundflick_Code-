import RoleManagement from './roleManagement';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RolesForm } from './roleForm';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_ROLE_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { setRoleFormOpen } from '@/redux/slices/roles';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { Helmet } from 'react-helmet';
import PageHeader from '@/components/shared/pageHeader';
import { Plus } from 'lucide-react';

export default function Roles() {
  const dispatch = useDispatch();
  const { roleFormOpen } = useSelector((state: RootState) => state.roles);
  useEffect(() => {
    dispatch({ type: FETCH_ROLE_DATA });
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>LOS | Roles</title>
      </Helmet>
      {/* <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
          
        </div>
      </div> */}
      <PageHeader
        title="roles"
        actions={
          <Dialog
            open={roleFormOpen}
            onOpenChange={(open) => {
              dispatch(setRoleFormOpen(open));
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Plus className="h-4 w-4" />
                <I8nTextWrapper text="createRole" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  <I8nTextWrapper text="createRole" />
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <RolesForm />
            </DialogContent>
          </Dialog>
        }
      />
      <RoleManagement />
    </>
  );
}
