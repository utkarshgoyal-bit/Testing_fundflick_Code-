import { Types } from "mongoose";
import BranchSchema from "../../models/branches";

const buildNestedTree = (rootId: string, branches: any[]) => {
  const map = new Map<string, any>();

  // Initialize each branch with children array
  branches.forEach((branch) => {
    map.set(branch._id.toString(), { ...branch, children: [] });
  });

  // Connect children to their parent
  branches.forEach((branch) => {
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

const getBranch = async (loginUser: any, isRoot: string) => {
  const query: any = {
    organization: loginUser.organization._id,
  };

  if (isRoot === "true") {
    query.isRoot = true;
  }

  const dbQuery = {
    ...query,
    $or: [{ IS_DELETED: false }, { IS_DELETED: { $exists: false } }],
  };

  const branches = await BranchSchema.aggregate([
    {
      $match: dbQuery,
    },
    {
      $graphLookup: {
        from: "branchesv2",
        startWith: "$children",
        connectFromField: "children",
        connectToField: "_id",
        as: "allChildren",
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

  const trees = branches.map((root) => {
    const { allChildren, ...rootData } = root;
    const allBranches = [rootData, ...allChildren];
    return buildNestedTree(root._id.toString(), allBranches);
  });

  return trees;
};

export default getBranch;
