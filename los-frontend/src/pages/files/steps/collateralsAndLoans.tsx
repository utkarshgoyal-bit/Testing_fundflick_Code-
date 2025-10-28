import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import apiCaller from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import {
  COLLATERALTYPE,
  DOCUMENTYPE,
  FUELTYPE,
  LOAN_TYPES,
  PROPERTYLOAN,
  PROPERTYTYPE,
  STEPS_NAMES,
  VEHICLELOAN,
  VEHICLETYPE,
} from '@/lib/enums';
import { ADD_CUSTOMER_COLLATERAL_DATA, GET_CUSTOMER_COLLATERAL_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import GetCoordinates from '@/utils/getCoordinates';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import debounce from 'debounce';
import { ChevronRight, LocateFixedIcon } from 'lucide-react';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { z } from 'zod';
import VerifyStepData from './verifyStepData';

const landAreaOptions = [
  { label: 'Acres', value: 'Acres' },
  { label: 'Hectares', value: 'Hectares' },
  { label: 'SqFt', value: 'SquareFeet' },
  { label: 'SqMt', value: 'SquareMeter' },
  { label: 'SqYds', value: 'SquareYds' },
];
type LandAreaOptions = {
  label: string;
  value: 'Acres' | 'Hectares' | 'SquareFeet' | 'SquareMeter' | 'SquareYds';
};

const conversionRates: Record<LandAreaOptions['value'], number> = {
  Acres: 43560, // 1 Acre = 43560 Square Feet
  Hectares: 107639.104, // 1 Hectare = 107639.104 Square Feet
  SquareFeet: 1, // 1 Square Foot = 1 Square Foot
  SquareMeter: 10.7639, // 1 Square Meter = 10.7639 Square Feet
  SquareYds: 9, // 1 Square Yard = 9 Square Feet
};
const landDetailsSchema = z.object({
  ownerName: z.string().min(1, 'Owner name is required'),
  existingOwner: z.string().optional(),
  contactNumber: z.string().min(1, 'Owner name is required'),
  landAreaUnit: z.string(),
  constructionAreaUnit: z.string(),
  purposeOfLoan: z.string().min(1, 'Purpose of loan is required'),
  relation: z.string().min(1, 'Relation is required'),
  propertyType: z.string().min(1, 'Property Type is required'),
  documentType: z.string().min(1, 'Document Type is required'),
  documentNumber: z.string().min(1, 'Document Number is required'),
  documentDate: z.string().min(1, 'Document Date is required'),
  societyName: z.string().min(1, 'Society Name is required'),
  colonyName: z.string().min(1, 'Colony Name is required'),
  colonyDeveloped: z.string().min(1, 'Colony Developed is required'),
  landArea: z.number().positive('Land Area must be positive'),
  constructionArea: z.union([
    z.number(),
    z.string().regex(/^\d+(\.\d+)?$/, 'Construction Area must be a number or decimal'),
  ]),
  location: z.string().min(1, 'Location is required'),
  addressLineTwo: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pltNo: z.string().min(1, 'PLT Number is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  gpsCoordinates: z.string().min(1, 'GPS coordinates are required').optional(),
  estimatedLandValue: z.number().positive('Estimated Land Value must be positive'),
  estimatedBuildUpValue: z.number().positive('Estimated Build Up Value must be positive'),
  totalLandValue: z.number().nonnegative('Total Land Value must be nonnegative'),
  comments: z.string().optional(),
});

const vehicleDetailsSchema = z.object({
  ownerName: z.string().min(1, 'Owner name is required'),
  existingOwner: z.string().optional(),
  value: z.number().positive('Value must be positive'),
  purposeOfLoan: z.string().min(1, 'Purpose of loan is required'),
  comments: z.string().optional(),

  vehicleDetails: z.object({
    vehicleType: z.string().min(1, 'Vehicle Type is required'),
    companyName: z.string().min(1, 'Company Name is required'),
    modelVariant: z.string().min(1, 'Model Variant is required'),
    fuelType: z.string().min(1, 'Fuel Type is required'),
    registrationNumber: z.string().optional(),
    registrationDate: z.string().optional(),
    validityDate: z.string().optional(),
    chassisNumber: z.string().min(1, 'Chasis Number is required'),
    engineNumber: z.string().min(1, 'Engine Number is required'),
    yearOfManufacture: z.string().min(1, 'Year of manufacture is required'),
    engineSize: z.string().min(1, 'Engine Size is required'),
  }),
});

const FormSchema = z.object({
  collateralDetails: z.array(
    z.discriminatedUnion('collateralType', [
      z.object({
        collateralType: z.literal('land'),
        landDetails: landDetailsSchema,
      }),
      z.object({
        collateralType: z.literal('vehicle'),
        vehicleDetails: vehicleDetailsSchema,
      }),
      z.object({
        collateralType: z.literal('other'),
      }),
    ])
  ),
});
export default function CollateralsAndLoans() {
  const dispatch = useDispatch();
  const isBackOffice = urlQueryParams('component') == 'back_office';
  const { loading } = useSelector((state: RootState) => state.publicSlice);
  const { collateral } = useSelector((state: RootState) => state.fileCollateral);

  const handleLocateClick = async (index: number) => {
    return new Promise((resolve, reject) => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const address = await GetCoordinates(latitude, longitude);
              if (address) {
                setAddressFields({ ...address, gpsCoordinates: `${latitude},${longitude}` }, index);
                resolve('Location found');
              } else {
                reject('Location not found please provide location access.');
              }
            },
            () => {
              reject('Error getting location: Please allow location access.');
            }
          );
        } else {
          reject('Geolocation is not supported by this browser.');
        }
      } catch (error) {
        reject('Error fetching address: ' + error);
      }
    });
  };

  // Removed duplicate declaration of setAddressFields

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...collateral,
      landDetails: {
        constructionAreaUnit: 'SquareFeet',
        landAreaUnit: 'SquareYds',
        ...collateral.landDetails,
      },
    },
  });
  const collateralDetailsFields = useFieldArray({
    control: form.control,
    name: 'collateralDetails',
  });
  const convertArea = (
    value: number | null,
    fromUnit: LandAreaOptions['value'],
    toUnit: LandAreaOptions['value']
  ): number | null => {
    if (!value || fromUnit === toUnit) return value;
    const inSquareFeet = value * conversionRates[fromUnit];
    const result = parseFloat((inSquareFeet / conversionRates[toUnit]).toFixed(2));
    return isNaN(result) ? 0 : result;
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_CUSTOMER_COLLATERAL_DATA,
      payload: { ...data, _id: collateral._id },
    });
  }
  const appendLandDetails = () => {
    collateralDetailsFields.append({
      collateralType: 'land',
      landDetails: {
        colonyName: '',
        colonyDeveloped: '',
        landArea: null as any,
        constructionArea: null as any,
        location: '',
        addressLineTwo: '',
        state: '',
        city: '',
        pltNo: '',
        pincode: '',
        gpsCoordinates: '',
        estimatedLandValue: null as any,
        estimatedBuildUpValue: null as any,
        totalLandValue: null as any,
        comments: '',
        landAreaUnit: 'SquareYds',
        constructionAreaUnit: 'SquareFeet',
        purposeOfLoan: '',
        ownerName: '',
        existingOwner: '',
        contactNumber: '',
        relation: '',
        propertyType: '',
        documentType: '',
        documentNumber: '',
        documentDate: '',
        societyName: '',
      },
    });
  };
  const appendVehicleDetails = () => {
    collateralDetailsFields.append({
      collateralType: 'vehicle',
      vehicleDetails: {
        ownerName: '',
        existingOwner: '',
        value: null as any,
        purposeOfLoan: '',
        comments: '',
        vehicleDetails: {
          vehicleType: '',
          companyName: '',
          modelVariant: '',
          fuelType: '',
          registrationNumber: '',
          registrationDate: '',
          validityDate: '',
          chassisNumber: '',
          engineNumber: '',
          yearOfManufacture: '',
          engineSize: '',
        },
      },
    });
  };

  const handleDeleteCollateralDetails = (index: number) => {
    collateralDetailsFields.remove(index);
  };

  const setTotalLandValue = (index: number) => {
    const estimatedLandValue = form.watch(`collateralDetails.${index}.landDetails.estimatedLandValue`);
    const estimatedBuildUpValue = form.watch(`collateralDetails.${index}.landDetails.estimatedBuildUpValue`);
    const totalLandValue = Number(estimatedLandValue) + Number(estimatedBuildUpValue);
    if (!isNaN(totalLandValue)) {
      form.setValue(`collateralDetails.${index}.landDetails.totalLandValue`, totalLandValue);
    }
  };
  const handleChassisNumber = useCallback(
    debounce(async (value: string, index: number) => {
      if (!value) return;
      const response = await apiCaller<{
        chassisNumber: string;
        companyName: string;
        engineNumber: string;
        engineSize: string;
        fuelType: string;
        modelVariant: string;
        registrationDate: string;
        registrationNumber: string;
        validityDate: string;
        vehicleType: string;
        yearOfManufacture: string;
      }>('/customer-file/file-operations/vehicle-details/?chassisNumber=' + value, 'GET', {});
      if (!(response instanceof AxiosError) && response.data) {
        console.log(response.data);
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.modelVariant`,
          response.data.modelVariant
        );
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.companyName`,
          response.data.companyName
        );
        form.setValue(`collateralDetails.${index}.vehicleDetails.vehicleDetails.fuelType`, response.data.fuelType);
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.registrationNumber`,
          response.data.registrationNumber
        );
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.registrationDate`,
          response.data.registrationDate
        );
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.validityDate`,
          response.data.validityDate
        );
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.chassisNumber`,
          response.data.chassisNumber
        );
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.engineNumber`,
          response.data.engineNumber
        );
        form.setValue(`collateralDetails.${index}.vehicleDetails.vehicleDetails.engineSize`, response.data.engineSize);
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.vehicleType`,
          response.data.vehicleType
        );
        form.setValue(
          `collateralDetails.${index}.vehicleDetails.vehicleDetails.yearOfManufacture`,
          response.data.yearOfManufacture
        );

        // form.setValue(`collateralDetails.${index}.vehicleDetails.chassisNumber`, response.data.);
        // form.setValue(`bank.${index}.branchName`, response.data.BRANCH);
      }
    }, 800),
    []
  );

  const setAddressFields = (address: any, index: number) => {
    if (!address) return;

    form.setValue(`collateralDetails.${index}.landDetails.location`, address.addressLine || 'N/A');
    form.setValue(`collateralDetails.${index}.landDetails.addressLineTwo`, address.addressLineTwo || 'N/A');
    form.setValue(`collateralDetails.${index}.landDetails.city`, address.city || 'N/A');
    form.setValue(`collateralDetails.${index}.landDetails.state`, address.state || 'N/A');
    form.setValue(`collateralDetails.${index}.landDetails.pincode`, address.pinCode || 'N/A');
    form.setValue(`collateralDetails.${index}.landDetails.gpsCoordinates`, address.gpsCoordinates || 'N/A');
  };
  const handleExistingAddressChange = (value: string, index: number) => {
    return (
      value !== 'other' &&
      collateral?.address?.map((item: any) => {
        if (item.addressLine === value) {
          form.setValue(`collateralDetails.${index}.landDetails.location`, item.addressLine || 'N/A');
          form.setValue(`collateralDetails.${index}.landDetails.addressLineTwo`, item.addressLineTwo || 'N/A');
          form.setValue(`collateralDetails.${index}.landDetails.pltNo`, item.pltNo || 'N/A');
          form.setValue(`collateralDetails.${index}.landDetails.state`, item.state || 'N/A');
          form.setValue(`collateralDetails.${index}.landDetails.city`, item.city || 'N/A');
          form.setValue(`collateralDetails.${index}.landDetails.pincode`, item.pinCode || 'N/A');
          form.setValue(`collateralDetails.${index}.landDetails.gpsCoordinates`, item.gpsCoordinates || 'N/A');
        }
      })
    );
  };
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_COLLATERAL_DATA });
  }, []);

  useEffect(() => {
    if (collateral.loanType === 'home loan' && collateralDetailsFields.fields.length === 0) {
      appendLandDetails();
    } else if (collateral.loanType === 'vehicle loan' && collateralDetailsFields.fields.length === 0) {
      appendVehicleDetails();
    }
  }, [collateral, collateralDetailsFields.fields]);

  useEffect(() => {
    if (collateral.loanType === LOAN_TYPES.HOME_LOAN && collateralDetailsFields.fields.length === 0) {
      form.reset(collateral);
      appendLandDetails();
    } else if (collateral.loanType === LOAN_TYPES.VEHICLE_LOAN && collateralDetailsFields.fields.length === 0) {
      form.reset(collateral);
      appendVehicleDetails();
    }
  }, [collateral]);

  if (loading) {
    return null;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full  relative max-md:space-y-3 gap-3 md:p-5 mx-md:px-3 px-3"
      >
        <h2 className="col-span-2 font-bold text-xl max-md:text-lg">Collateral and Loan Details</h2>
        <div className="w-full flex justify-end  gap-2 my-2">
          <Button
            className="bg-secondary hover:bg-secondary/90 text-white"
            onClick={() => appendLandDetails()}
            type="button"
          >
            Add Collateral Land
          </Button>
          <Button
            className="bg-secondary hover:bg-secondary/90 text-white"
            onClick={() => appendVehicleDetails()}
            type="button"
          >
            Add Collateral Vehicle
          </Button>
        </div>
        <Separator className="col-span-2 bg-secondary my-2" />

        {collateralDetailsFields.fields.map((field, index) => (
          <div key={field.id}>
            {/* Collateral Type */}
            <FormField
              control={form.control}
              name={`collateralDetails.${index}.collateralType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="max-md:text-sm">Collateral Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger disabled={index === 0}>
                        <SelectValue placeholder="Select Collateral Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLLATERALTYPE?.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Land Details */}
            {form.watch(`collateralDetails.${index}.collateralType`) === 'land' && (
              <div>
                <h3 className=" font-semibold text-lg my-3 bg-secondary text-white rounded-md py-2 px-3">
                  Property Details
                </h3>
                <div className="md:grid md:grid-cols-2 gap-3 grid-cols-1 w-ful">
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.purposeOfLoan`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Purpose of Loan <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROPERTYLOAN?.map((type: { label: string; value: string }) => (
                                <SelectItem value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {/* <FormControl>
                            <Input placeholder="Purpose of loan" {...field} />
                          </FormControl> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {['Purchase case', 'Purchase + Construction'].includes(
                    form.watch(`collateralDetails.${index}.landDetails.purposeOfLoan`)
                  ) && (
                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.landDetails.existingOwner`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Existing Owner</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Owner name"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.ownerName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          New Owner <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue(
                              `collateralDetails.${index}.landDetails.relation`,
                              collateral.allFamilyMembers.find((family: any) => family._id == value)?.relation || 'self'
                            );
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a owner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {collateral.allFamilyMembers?.map((family: any) => {
                              if (['self', 'co-applicant'].includes(family.customerType)) {
                                return (
                                  <SelectItem value={family._id}>{`${family.firstName} ${family.middleName || ''} ${
                                    family.lastName || ''
                                  } (${family.customerType})`}</SelectItem>
                                );
                              }
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {['Purchase case', 'Purchase + Construction'].includes(
                    form.watch(`collateralDetails.${index}.landDetails.purposeOfLoan`)
                  ) && (
                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.landDetails.contactNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contact Number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.propertyType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Property Type <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROPERTYTYPE?.map((type) => <SelectItem value={type.value}>{type.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.documentType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Document Type <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Document Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {DOCUMENTYPE?.map((type) => <SelectItem value={type.value}>{type.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.documentNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Document Number <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Document Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.documentDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Document Date <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? moment(field.value).format('YYYY-MM-DD') : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.societyName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Panchayat / Society Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Panchayat / Society Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.colonyName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Street / Colony Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Street / Colony Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.colonyDeveloped`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Colony Development Percentage <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Colony Development Percentage " />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0%">0%</SelectItem>
                              <SelectItem value="25%">25%</SelectItem>
                              <SelectItem value="50%">50%</SelectItem>
                              <SelectItem value="75%">75%</SelectItem>
                              <SelectItem value="100%">100%</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.landDetails.landArea`}
                      render={({ field }) => (
                        <FormItem className="w-[80%]">
                          <FormLabel>
                            Property Area <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Property Area"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.length ? parseFloat(parseFloat(e.target.value).toFixed(2)) : null
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.landDetails.landAreaUnit`}
                      render={({ field }) => (
                        <FormItem className="w-[20%]">
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value: LandAreaOptions['value']) => {
                                const updatedValue = convertArea(
                                  form.getValues(`collateralDetails.${index}.landDetails.landArea`) as number | null,
                                  (form.getValues(
                                    `collateralDetails.${index}.landDetails.landAreaUnit`
                                  ) as LandAreaOptions['value']) || 'SquareYds',
                                  value
                                );
                                form.setValue(`collateralDetails.${index}.landDetails.landArea`, updatedValue || 0);
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Area Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {landAreaOptions?.map((unit) => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.landDetails.constructionArea`}
                      render={({ field }) => (
                        <FormItem className="w-[80%]">
                          <FormLabel>Total Construction Area </FormLabel>
                          <FormControl>
                            <Input
                              className=""
                              type="number"
                              placeholder="Construction Area"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.length ? parseFloat(parseFloat(e.target.value).toFixed(2)) : null
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.landDetails.constructionAreaUnit`}
                      render={({ field }) => (
                        <FormItem className="w-[20%]">
                          <FormControl>
                            <Select
                              {...field}
                              onValueChange={(value: LandAreaOptions['value']) => {
                                const updatedValue = convertArea(
                                  form.getValues(`collateralDetails.${index}.landDetails.constructionArea`) as
                                    | number
                                    | null,
                                  (form.getValues(
                                    `collateralDetails.${index}.landDetails.constructionAreaUnit`
                                  ) as LandAreaOptions['value']) || 'SquareFeet',
                                  value
                                );
                                form.setValue(
                                  `collateralDetails.${index}.landDetails.constructionArea`,
                                  updatedValue || 0
                                );
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger value={field.value}>
                                <SelectValue placeholder="Select Area Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {landAreaOptions?.map((unit) => (
                                  <SelectItem key={unit.value + 'construction'} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.estimatedLandValue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Estimated Property Value <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isBackOffice}
                            type="number"
                            placeholder="Estimated Property Value"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value.length ? +e.target.value : null);
                              setTotalLandValue(index);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.estimatedBuildUpValue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Estimated Build Up Value <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isBackOffice}
                            type="number"
                            placeholder="Estimated Build Up Value"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value.length ? +e.target.value : null);
                              setTotalLandValue(index);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.totalLandValue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Property Value</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            type="number"
                            placeholder="Total Property Value"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value.length ? Number(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.comments`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Description (Remarks)</FormLabel>
                        <FormControl>
                          <Input placeholder="Property Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className="col-span-2" />
                  <div>
                    <FormLabel>Existing Address</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        handleExistingAddressChange(value, index);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Existing Address" />
                      </SelectTrigger>
                      <SelectContent>
                        {collateral?.address
                          .map((item: any) => item.addressLine)
                          .filter((value: any, index: number, self: any) => self.indexOf(value) === index)
                          .map((item: any, index: number) => (
                            <SelectItem value={item || 'N/A'} key={index}>
                              {item || 'N/A'}
                              {index === 0 ? ' (Primary)' : ''}
                            </SelectItem>
                          ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormField
                    name={`collateralDetails.${index}.landDetails.pltNo`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {'Plot .No / Patta No. / Khasra No.'} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Plot .No / Patta No. / Khasra No." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Address <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`collateralDetails.${index}.landDetails.addressLineTwo`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{'Address Line 2'}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter address line" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.state`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          State <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.city`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          City <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.landDetails.pincode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {'Pincode '} <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input maxLength={6} placeholder="Pincode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormField
                      name={`collateralDetails.${index}.landDetails.gpsCoordinates`} // fatch gps codinet from gis maping
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{'GPS Coordinates '}</FormLabel>
                          <div className="flex items-center gap-3">
                            <FormControl>
                              <Input placeholder="Enter GPS Coordinates" {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              onClick={() =>
                                toast.promise(handleLocateClick(index), {
                                  pending: 'Locating...',
                                  success: 'Location found',
                                  error: 'Location not found please provide location access.',
                                })
                              }
                            >
                              <LocateFixedIcon size={20} />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Vehicle Details */}
            {form.watch(`collateralDetails.${index}.collateralType`) === 'vehicle' && (
              <div>
                <h3 className="col-span-2 font-semibold text-lg my-3 bg-secondary text-white rounded-md py-2 px-3">
                  Vehicle Details
                </h3>
                <div className="grid  md:grid-cols-2 w-full gap-3 grid-cols-1">
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.purposeOfLoan`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Purpose of Loan <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Purpose of Loan" />
                            </SelectTrigger>
                            <SelectContent>
                              {VEHICLELOAN?.map((type: { label: string; value: string }) => (
                                <SelectItem value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch(`collateralDetails.${index}.vehicleDetails.purposeOfLoan`) === 'Purchase case' && (
                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.vehicleDetails.ownerName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Owner</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Owner name"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch(`collateralDetails.${index}.vehicleDetails.purposeOfLoan`) === 'Purchase case' && (
                    <FormField
                      control={form.control}
                      name={`collateralDetails.${index}.vehicleDetails.existingOwner`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Existing Owner</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Existing Owner name"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.chassisNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Chasis Number <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Chasis Number"
                            {...field}
                            onChange={(e) => {
                              handleChassisNumber(e.target.value, index);
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.ownerName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Owner Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a owner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {collateral.allFamilyMembers?.map((family: any) => {
                              if (['self', 'co-applicant'].includes(family.customerType)) {
                                return (
                                  <SelectItem value={family._id}>{`${family.firstName} ${family.middleName || ''} ${
                                    family.lastName || ''
                                  } (${family.customerType})`}</SelectItem>
                                );
                              }
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.vehicleType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Vehicle Type <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Vehicle Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {VEHICLETYPE?.map((vehicleType) => (
                                <SelectItem key={vehicleType.value} value={vehicleType.value}>
                                  {vehicleType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.fuelType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Fuel Type <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Vehicle Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {FUELTYPE?.map((fuelType) => (
                                <SelectItem key={fuelType.value} value={fuelType.value}>
                                  {fuelType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.companyName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Maker Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Maker Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.modelVariant`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Model Name and Variant <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Model Name and Variant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.registrationNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Registration Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.registrationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? moment(field.value).format('YYYY-MM-DD') : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.validityDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration valid till</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? moment(field.value).format('YYYY-MM-DD') : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.engineNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Engine Number <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Engine Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Estimate valuation <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isBackOffice}
                            type="number"
                            placeholder="Value"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value.length ? +e.target.value : null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.yearOfManufacture`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Year of Manufacture <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Year of Manufacture" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.vehicleDetails.engineSize`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Engine Size <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="1000cc" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`collateralDetails.${index}.vehicleDetails.comments`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <textarea
                            className="max-md:text-sm block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm leading-6 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Write Remarks"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            {collateralDetailsFields.fields.length > 1 && index > 0 && (
              <div>
                <Button className="col-span-2 bg-secondary my-3" onClick={() => handleDeleteCollateralDetails(index)}>
                  Delete
                </Button>
              </div>
            )}
            <Separator className="col-span-2 bg-secondary my-3" />
          </div>
        ))}
        <div className="flex col-span-2  w-full justify-end  items-center gap-5  ">
          <VerifyStepData stepName={STEPS_NAMES.COLLATERAL} stepsData={collateral} />
          <div className="flex justify-end col-span-2 gap-4 my-3">
            <Button type="submit" disabled={loading}>
              {'Save and next'} <ChevronRight />{' '}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
