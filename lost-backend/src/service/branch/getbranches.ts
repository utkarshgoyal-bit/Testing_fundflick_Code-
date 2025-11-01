import { Types } from 'mongoose';
import isSuperAdmin from '../../helper/booleanCheck/isSuperAdmin';
import { LoginUser } from '../../interfaces';
import BranchSchema from '../../schema/branches';

type BranchNode = {
  _id: Types.ObjectId;
  name: string;
  children: BranchNode[];
};

const buildNestedTree = (
  rootId: string,
  branches: { _id: Types.ObjectId; name: string; children: Types.ObjectId[] }[]
): BranchNode | undefined => {
  const map = new Map<string, BranchNode & { originalChildren?: Types.ObjectId[] }>();

  branches.forEach(branch => {
    map.set(branch._id.toString(), {
      _id: branch._id,
      name: branch.name,
      children: [],
      originalChildren: branch.children,
    });
  });

  map.forEach(parent => {
    if (parent.originalChildren?.length) {
      parent.originalChildren.forEach((childId: Types.ObjectId) => {
        const child = map.get(childId.toString());
        if (child && child._id.toString() !== parent._id.toString()) {
          parent.children.push(child);
        }
      });
    }
    delete parent.originalChildren;
  });

  return map.get(rootId);
};

const getBranch = async (loginUser: LoginUser, isRoot: string) => {
  const query: { [key: string]: unknown } = {
    organization: loginUser.organization._id,
  };

  if (isRoot === 'true') {
    query.isRoot = true;
  }

  const dbQuery: { [key: string]: unknown } = {
    ...query,
    $or: [{ IS_DELETED: false }, { IS_DELETED: { $exists: false } }],
  };

  if (!isSuperAdmin([loginUser.role])) {
    dbQuery.name = { $in: loginUser.branches };
  }

  const branches = await BranchSchema.aggregate([
    {
      $match: dbQuery,
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
        // Include all fields from root
        _id: 1,
        name: 1,
        children: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        address: 1,
        landMark: 1,
        country: 1,
        state: 1,
        city: 1,
        postalCode: 1,
        isRoot: 1,
        isActive: 1,
        IS_DELETED: 1,
        allChildren: 1,
      },
    },
  ]);

  if (!branches.length) return [];

  const trees = branches.map(root => {
    const { allChildren, ...rootData } = root;
    const allBranches = [rootData, ...allChildren];
    return buildNestedTree(root._id.toString(), allBranches);
  });

  return trees;
};

export default getBranch;
