import { Types } from 'mongoose';
import BranchSchema from '../../schema/branches';

// Step 1: Recursive tree builder
const buildNestedTree = (rootId: string, branches: any[]) => {
  const map = new Map<string, any>();

  // Initialize each branch with minimal fields and empty children
  branches.forEach(branch => {
    map.set(branch._id.toString(), {
      _id: branch._id,
      name: branch.name,
      children: [],
    });
  });

  // Connect children as objects
  branches.forEach(branch => {
    const parent = map.get(branch._id.toString());

    if (branch.children?.length) {
      branch.children.forEach((childId: Types.ObjectId) => {
        const child = map.get(childId.toString());
        if (child && child._id.toString() !== parent._id.toString()) {
          parent.children.push(child);
        }
      });
    }
  });

  return map.get(rootId);
};

// Step 2: Aggregation + transformation logic
const getChildBranch = async (parentId: string, loginUser: any) => {
  const result = await BranchSchema.aggregate([
    {
      $match: { _id: new Types.ObjectId(parentId), organization: loginUser.organization._id },
    },
    {
      $graphLookup: {
        from: 'branchesv2',
        startWith: '$children',
        connectFromField: 'children',
        connectToField: '_id',
        as: 'allChildren',
        restrictSearchWithMatch: { IS_DELETED: false },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        children: 1,
        allChildren: {
          $map: {
            input: '$allChildren',
            as: 'branch',
            in: {
              _id: '$$branch._id',
              name: '$$branch.name',
              children: '$$branch.children',
            },
          },
        },
      },
    },
  ]);

  if (!result.length) return null;

  const root = result[0];

  // Merge root and all its descendants into one list
  const allBranches = [
    { _id: root._id, name: root.name, children: root.children },
    ...root.allChildren,
  ];

  // Return nested tree
  return buildNestedTree(parentId, allBranches);
};

export default getChildBranch;
