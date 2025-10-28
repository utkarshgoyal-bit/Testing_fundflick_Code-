export function calculateOverallProgress(photosData: any) {
  if (!photosData) return 0;

  const totalCategories = 5;
  const categories = ['kyc', 'income', 'liability', 'collateral', 'banking'];

  let completed = 0;

  categories.forEach((group) => {
    if (group === 'kyc') {
      const customerPhotos = [
        photosData.customerDetails?.uidFront,
        photosData.customerDetails?.uidBack,
      ];
      const familyPhotos = photosData.customerOtherFamilyDetails?.flatMap((p: any) => [
        p.customerDetails?.uidFront,
        p.customerDetails?.uidBack,
      ]) || [];
      const groupPhotos = photosData.photos?.filter((p: any) => p.photoGroup === 'kyc').map((p: { photo: any; }) => p.photo) || [];
      const allPhotos = [...customerPhotos, ...familyPhotos, ...groupPhotos];
      if (allPhotos.some(Boolean)) completed += 1;
    } else {
      const groupPhotos = photosData.photos?.filter((p: any) => p.photoGroup === group).map((p: { photo: any; }) => p.photo) || [];
      if (groupPhotos.some(Boolean)) completed += 1;
    }
  });

  return (completed / totalCategories) * 100; 
}

export function calculateAssociatesKYCProgress(associatesData: any): number {
  if (!associatesData) return 0;

  let completed = 0;
  let totalFields = 0;
  if (associatesData.customerDetails) {
    totalFields += 1;
    if (associatesData.customerDetails.aadhaarVerified) {
      completed += 1;
    }
  }
  if (Array.isArray(associatesData.customerOtherFamilyDetails) && associatesData.customerOtherFamilyDetails.length) {
    associatesData.customerOtherFamilyDetails.forEach((associate: any) => {
      if (associate?.customerDetails) {
        totalFields += 1;
        if (associate.customerDetails.aadhaarVerified) {
          completed += 1;
        }
      }
    });
  }

  if (totalFields === 0) return 0;

  return Math.round((completed / totalFields) * 100);
}



export function calculateFileVerificationProgress(selectedFile: any, steps: { name: string }[]) {
  if (!selectedFile || !steps?.length) return 0;

  const totalSteps = steps.length;
  let completed = 0;

  steps.forEach((step) => {
    const isVerified = selectedFile?.verifiedSteps?.find(
      (item: { step: string; isVerified: boolean }) => item.step === step.name
    )?.isVerified;

    if (isVerified) completed += 1;
  });

  const percent = (completed / totalSteps) * 100;

  return Math.round(percent); 
}

export function calculateCibilProgress(
  selectedFile: {
    cibilDetails?: any[];
    customerDetails?: { _id?: any };
    customerOtherFamilyDetails?: any[];
  } | undefined,
  customerId: any
) {
  if (!selectedFile) return 0;
  const cibil = selectedFile.cibilDetails?.find(
    (item: any) => item.customerDetails === customerId
  );
  const customer =
    selectedFile.customerDetails?._id === customerId
      ? selectedFile.customerDetails
      : selectedFile.customerOtherFamilyDetails?.find(
          (x) => x._id === customerId
        );
  if (!customer && !cibil) return 0;

  const fieldsToCheck = [
    customer?.aadhaarNumber,
    customer?.personalPan,
    customer?.dob,
    customer?.otherId,
    cibil?.Score ?? cibil?.score, 
    cibil?.file,
  ];
  const validFields = fieldsToCheck.filter((f) => f !== undefined);
  const filledFields = validFields.filter(
    (f) => f !== null && f !== ""
  ).length;

  return validFields.length > 0
    ? Math.round((filledFields / validFields.length) * 100)
    : 0;
}

export function calculateTeleVerificationProgress(selectedFile: any): number {
  if (!selectedFile?.teleVerificationReport) return 0;

  const { review, description } = selectedFile.teleVerificationReport;

  let completed = 0;
  const total = 2;

  if (review) completed += 1;
  if (description) completed += 1;

  return Math.round((completed / total) * 100); 
}

export function calculatePersonalDetailsProgress(personalDetails: any) {
  if (!personalDetails) return 0;
  const fieldsToCheck = [
    personalDetails?.whoMet,
    personalDetails?.loanRequired,
    personalDetails?.loanUse,
  ];

  const validFields = fieldsToCheck.filter((f) => f !== undefined);
  const filledFields = validFields.filter(
    (f) => f !== null && f !== ""
  ).length;

  return validFields.length > 0
    ? Math.round((filledFields / validFields.length) * 100)
    : 0;
}

export function calculatePropertyDetailsProgress(values: any): number {
  if (!values) return 0;

  const requiredFields = [
    "assetsSeen",
    "estimatedCost",
    "marketability",
    "deviationSeen",
    "eMeterInstalled",
    "commonEntrance",
    "mismatchBoundaries",
    "neighborName",
    "coordinates",
    // "livingStandard",
    "remarks",
  ];

  let completed = 0;
 requiredFields.forEach((field) => {
  const value = values[field];
   const isCompleted =
      typeof value === "boolean" ||
      (typeof value === "object" && value !== null && Object.keys(value).length > 0) ||
      (typeof value === "string" && value.trim() !== "") ||
      (typeof value === "number" && !isNaN(value));

    if (isCompleted) completed += 1;

    console.log(`Field: ${field} | Value: ${value} | Completed: ${isCompleted}`);
  });

  return Math.round((completed / requiredFields.length) * 100);
}


export function calculateIncomeProgress(
  incomeDetails: any[] | undefined,
  liabilityDetails: any[] | undefined,
  customerIds: string[]
): number {
  if (!customerIds || customerIds.length === 0) return 0;

  const requiredIncomeFields = ['income', 'monthlyOtherIncome', 'occupation', 'occupationCategory','remarks'];
  const requiredLiabilityFields = ['loanType', 'loanAmount', 'emi', 'tenure', 'irr', 'paymentsMade', 'foreclosure', 'noOfemiLeft', 'noOfEmiPaid','comments'];

  let completedFields = 0;
  let totalFields = 0;

  customerIds.forEach(id => {
    const income = incomeDetails?.find(i => {
      if (!i) return false;
      if (typeof i.customerDetails === 'string') return i.customerDetails === id;
      if (i.customerDetails?._id) return i.customerDetails._id === id;
      return false;
    }) ?? {};

    const liability = liabilityDetails?.find(l => {
      if (!l) return false;
      if (typeof l.customerDetails === 'string') return l.customerDetails === id;
      if (l.customerDetails?._id) return l.customerDetails._id === id;
      return false;
    }) ?? {};

    const incomeFilled = requiredIncomeFields.filter(f => income[f] != null && income[f] !== '').length;
    const liabilityFilled = requiredLiabilityFields.filter(f => liability[f] != null && liability[f] !== '').length;

    totalFields += requiredIncomeFields.length + requiredLiabilityFields.length;
    completedFields += incomeFilled + liabilityFilled;
  });

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
}








export function calculateFamilyProgress(familyDetails: any): number {
  if (!familyDetails) return 0;

  const requiredFields = [
    "isMarried",
    "fatherLive",
    "motherLive",
    "children",
    "siblings",
    "earningMembers",
    "monthlyEarning",
  ]; 

  let completed = 0;

  requiredFields.forEach((field) => {
    const value = familyDetails[field];
    if (value !== undefined && value !== null && value !== "") {
      completed++;
    }
  });

  return Math.round((completed / requiredFields.length) * 100);
}

export function calculatePhotosProgress(photos: any): number {
  if (!photos || !photos.photos) return 0;

  const groups = ["kyc", "income", "liability", "collateral", "banking", "other"];
  let completed = 0;

  groups.forEach((group) => {
    const hasPhoto = photos.photos.some(
      (item: any) => item.photoGroup === group && item.photo
    );
    if (hasPhoto) completed++;
  });

  return Math.round((completed / groups.length) * 100);
}



