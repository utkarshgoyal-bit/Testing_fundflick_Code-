import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

export async function exportCustomerToExcel(customerData: any) {
  const workbook = new ExcelJS.Workbook();
  const templateUrl = '/blankcam.xlsx';
  const response = await fetch(templateUrl);
  const buffer = await response.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet('Sheet1');
  if (!sheet) return;

  // ---- Main Applicant ----
  const dob = customerData.customerDetails?.dob;
  const age = dob ? moment().diff(moment(dob), 'years') : '';

  sheet.getCell('B7').value =
    `${customerData.customerDetails?.firstName ?? ''} ${customerData.customerDetails?.middleName ?? ''} ${customerData.customerDetails?.lastName ?? ''}`.trim();
  sheet.getCell('F7').value = age ?? '';
  sheet.getCell('G7').value = customerData.customerDetails?.gender ?? '';
  sheet.getCell('K7').value = customerData.customerDetails?.phone ?? '';
  sheet.getCell('G2').value = customerData.customerDetails?.email ?? '';
  sheet.getCell('H2').value = customerData.customerDetails?.aadhaarNumber ?? '';

  // ---- Co-Applicant (first one) ----
  const coApplicants =
    customerData.customerOtherFamilyDetails?.filter((member: any) => member.customerType === 'co-applicant') || [];

  coApplicants.forEach((coApplicant: any, index: number) => {
    const row = 8 + index;

    const coDob = coApplicant.customerDetails?.dob;
    const coAge = coDob ? moment().diff(moment(coDob), 'years') : '';

    sheet.getCell(`B${row}`).value =
      `${coApplicant.customerDetails?.firstName ?? ''} ${coApplicant.customerDetails?.middleName ?? ''} ${coApplicant.customerDetails?.lastName ?? ''}`.trim();

    sheet.getCell(`F${row}`).value = coAge ?? '';
    sheet.getCell(`G${row}`).value = coApplicant.customerDetails?.gender ?? '';
    sheet.getCell(`K${row}`).value = coApplicant.customerDetails?.phone ?? '';
    sheet.getCell(`L${row}`).value = coApplicant.relation ?? '';
  });

  // ---- Address (join all addresses) ----
  const fullAddress =
    customerData.address
      ?.map(
        (addr: any) =>
          `Plot No: ${addr.pltNo}, ${addr.addressLine}, ${addr.addressLineTwo || ''}, ${addr.city}, ${addr.state}, ${addr.country}, PIN: ${addr.pinCode}`
      )
      .join(' | ') ?? '';
  sheet.getCell('C13').value = fullAddress;

  // ---- Property / Collateral ----
  const propertyAddress =
    customerData.collateralDetails
      ?.map(
        (addr: any) =>
          `CollateralType: ${addr.collateralType}, Location: ${addr.location || ''}, City: ${addr.city || ''}, State: ${addr.state || ''}, Land Area: ${addr.landArea || ''}, Construction Area: ${addr.constructionArea || ''}`
      )
      .join(' | ') ?? '';
  sheet.getCell('B14').value = propertyAddress;

  // ---- Office Info (first entry) ----
  const officeInfo = customerData.customerOtherInformation?.[0];
  if (officeInfo) {
    sheet.getCell('C15').value = officeInfo.officeAddress ?? '';
    sheet.getCell('C16').value = officeInfo.officeContact ?? '';
  }

  // ---- Collateral Value (first entry -> vehicle) ----
  const firstCollateral = customerData.collateralDetails?.[0];
  if (firstCollateral?.vehicleDetails?.value) {
    sheet.getCell('C17').value = firstCollateral.vehicleDetails.value;
  }

  // ---- Other fields ----
  sheet.getCell('C18').value = customerData.emiComfort ?? '';

  sheet.getCell('B4').value = customerData.loanAmount ?? 0;
  sheet.getCell('C4').value = customerData.loanTenure ?? 0;
  sheet.getCell('D4').value = customerData.emiComfort ?? 0;
  sheet.getCell('E4').value = customerData.status ?? '';
  sheet.getCell('F4').value = customerData.fileBranch ?? '';
  sheet.getCell('G4').value = customerData.loanType ?? '';
  sheet.getCell('H4').value = customerData.endUseOfMoney ?? '';

  sheet.getCell('B6').value = customerData.customerEmploymentDetails?.income ?? 0;
  sheet.getCell('C6').value = customerData.customerEmploymentDetails?.monthlyOtherIncome ?? 0;
  sheet.getCell('D6').value = customerData.customerEmploymentDetails?.occupation ?? '';
  sheet.getCell('E6').value = customerData.customerEmploymentDetails?.occupationCategory ?? '';

  sheet.getCell('B20').value = customerData.familyExpenses?.familyExpenses ?? 0;
  sheet.getCell('C20').value = customerData.familyExpenses?.futureOutlays ?? 0;

  const xlsxBuffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([xlsxBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `Customer_${customerData.customerDetails?.firstName ?? 'Unknown'}.xlsx`);
}
