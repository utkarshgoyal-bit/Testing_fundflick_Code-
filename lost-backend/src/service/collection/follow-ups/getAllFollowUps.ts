import FollowUpData from "../../../models/collection/followUpData";
const getAllFollowUps = async (loginUser: any) => {
  try {
    return await FollowUpData.find({ organization: loginUser.organization._id })
      .populate(["refCaseId", "createdBy"])
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error in fetchAllFollowUps:", error);
    throw new Error("An error occurred while fetching follow-up data.");
  }
};

export default getAllFollowUps;
