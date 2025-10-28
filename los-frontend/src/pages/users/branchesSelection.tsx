import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { IBranchTable } from '@/lib/interfaces';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

function collectAllBranchIds(branch: IBranchTable): string[] {
  let ids = [branch.name];
  if (branch.children && branch.children.length > 0) {
    for (const child of branch.children) {
      ids = ids.concat(collectAllBranchIds(child));
    }
  }
  return ids;
}

function BranchRoot({
  selectedBranches,
  setSelectedBranches,
  branch,
}: {
  branch: IBranchTable;
  selectedBranches?: string[];
  setSelectedBranches: Dispatch<SetStateAction<string[]>>;
}) {
  const [open, setOpen] = useState(true);
  if (!branch) return null;

  const handleCheckChange = (checked: boolean) => {
    const allIds = collectAllBranchIds(branch);
    setSelectedBranches((prev) => {
      const set = new Set(prev);
      if (checked) {
        allIds.forEach((id) => set.add(id));
      } else {
        allIds.forEach((id) => set.delete(id));
      }
      return Array.from(set);
    });
  };

  const isChecked = selectedBranches?.includes(branch.name) ?? false;
  return (
    <Collapsible open={open} onOpenChange={() => null}>
      <div className="flex items-center gap-2 border w-full p-2 rounded-md justify-between">
        <div className="flex items-center gap-2">
          <Checkbox checked={isChecked} onCheckedChange={(checked) => handleCheckChange(!!checked)} />
          {branch?.name} <span className="text-xs text-fg-secondary">({branch.children?.length})</span>
        </div>
        {branch.children && branch.children.length > 0 && (
          <Button type="button" className="h-5 py-2" variant="ghost" onClick={() => setOpen(!open)}>
            {open ? <ChevronDown /> : <ChevronRight />}
          </Button>
        )}
      </div>
      <CollapsibleContent className="flex flex-col justify-end items-end mt-2">
        <div className="w-[97%]">
          {branch.children?.map((child) => (
            <BranchRoot
              key={child._id}
              branch={child}
              selectedBranches={selectedBranches}
              setSelectedBranches={setSelectedBranches}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function BranchTree({
  data,
  selectedBranches,
  setSelectedBranches,
}: {
  data: IBranchTable[];
  selectedBranches: string[];
  setSelectedBranches: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div className="p-4 space-y-1">
      {data.map((branch) => (
        <BranchRoot
          branch={branch}
          key={branch._id}
          selectedBranches={selectedBranches}
          setSelectedBranches={setSelectedBranches}
        />
      ))}
    </div>
  );
}
