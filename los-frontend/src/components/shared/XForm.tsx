/* eslint-disable @typescript-eslint/no-explicit-any */
// DynamicForm.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import InputPhone from '@/components/ui/phoneInput';
import { IFieldConfig } from '@/lib/interfaces/xForm';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { AlertCircle, CheckCircle, Eye, EyeOff, HelpCircle, Upload, X } from 'lucide-react';

interface DynamicFormProps {
  config: IFieldConfig[];
  onSubmit: SubmitHandler<Record<string, string | boolean | number>>;
  schema: ZodSchema;
  defaultValues?: Record<string, any>;
  title?: string;
  description?: string;
  submitText?: string;
  className?: string;
  isLoading?: boolean;
}
const XForm: React.FC<DynamicFormProps> = ({
  config,
  onSubmit,
  schema,
  defaultValues,
  title = 'Form',
  description,
  submitText = 'Submit',
  className,
  isLoading = false,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, string | boolean | number>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [multiSelectValue, setMultiSelectValue] = React.useState<{
    [key: string]: any[];
  }>({});
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleFileUpload = (fieldName: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles((prev) => ({ ...prev, [fieldName]: fileArray }));
    }
  };

  const removeFile = (fieldName: string, index: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName]?.filter((_, i) => i !== index) || [],
    }));
  };

  useEffect(() => {
    const newMultiSelectValue = config.filter((item) => item.type === 'multiselect');
    if (defaultValues) {
      newMultiSelectValue.forEach((item) => {
        setMultiSelectValue({
          ...multiSelectValue,
          [item.name]: defaultValues[item.name] as any[],
        });
      });
    }
    reset(defaultValues);
  }, [config, defaultValues, multiSelectValue, reset]);

  const renderFieldIcon = (field: IFieldConfig) => {
    if (field.validations?.required?.value) {
      return <span className="text-color-error ml-1">*</span>;
    }
    return null;
  };

  const renderFieldTooltip = (field: IFieldConfig) => {
    if (field.placeholder) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-fg-tertiary ml-1 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{field.placeholder}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  const renderErrorMessage = (fieldName: string) => {
    if (errors[fieldName]) {
      return (
        <div className="flex items-center gap-1 mt-1 text-sm text-color-error">
          <AlertCircle className="h-4 w-4" />
          <span>{errors[fieldName]?.message}</span>
        </div>
      );
    }
    return null;
  };

  const getFieldClasses = (field: IFieldConfig) => {
    const baseClasses =
      'transition-all duration-200 bg-color-surface border-fg-border focus:border-color-primary focus:ring-2 focus:ring-color-primary/20';
    const errorClasses = errors[field.name]
      ? 'border-color-error focus:border-color-error focus:ring-color-error/20'
      : '';
    const disabledClasses = field.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return cn(baseClasses, errorClasses, disabledClasses);
  };
  return (
    <Card className={cn('border-0 shadow-lg bg-color-surface/80 backdrop-blur-sm', className)}>
      {(title || description) && (
        <CardHeader className="pb-6">
          {title && (
            <CardTitle className="text-2xl font-bold text-color-primary flex items-center gap-2">{title}</CardTitle>
          )}
          {description && <CardDescription className="text-fg-secondary">{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {config.map((field, index) => (
            <div key={field.name} className="space-y-2">
              <Label
                htmlFor={field.name}
                className={cn(
                  'text-sm font-medium text-color-primary flex items-center',
                  errors[field.name] && 'text-color-error'
                )}
              >
                {field.label}
                {renderFieldIcon(field)}
                {renderFieldTooltip(field)}
              </Label>
              {field.type === 'select' && field.options && (
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { value, onChange } }) => (
                    <Select value={String(value)} onValueChange={onChange} disabled={field.disabled}>
                      <SelectTrigger className={cn('h-12', getFieldClasses(field))}>
                        <SelectValue placeholder={field.placeholder || 'Select an option...'} />
                      </SelectTrigger>
                      <SelectContent className="bg-color-surface border-fg-border">
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {field.type === 'radio' && field.options && (
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={String(value)}
                      onValueChange={onChange}
                      disabled={field.disabled}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {field.options?.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="text-sm font-normal text-fg-primary cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              )}
              {field.type === 'checkbox' &&
                (field.options ? (
                  <div className="space-y-3">
                    {field.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Controller
                          control={control}
                          name={field.name}
                          render={({ field: { value, onChange } }) => (
                            <Checkbox
                              id={option.value}
                              checked={Array.isArray(value) ? value.includes(option.value) : value === option.value}
                              onCheckedChange={(checked) => {
                                if (Array.isArray(value)) {
                                  if (checked) {
                                    onChange([...value, option.value]);
                                  } else {
                                    onChange(value.filter((v) => v !== option.value));
                                  }
                                } else {
                                  onChange(checked ? option.value : '');
                                }
                              }}
                              disabled={field.disabled}
                              className="border-color-primary data-[state=checked]:bg-color-primary data-[state=checked]:border-color-primary"
                            />
                          )}
                        />
                        <Label htmlFor={option.value} className="text-sm font-normal text-fg-primary cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name={field.name}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          id={field.name}
                          checked={!!value}
                          onCheckedChange={onChange}
                          disabled={field.disabled}
                          className="border-color-primary data-[state=checked]:bg-color-primary data-[state=checked]:border-color-primary"
                        />
                      )}
                    />
                    <Label htmlFor={field.name} className="text-sm font-normal text-fg-primary cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ))}
              {field.type === 'password' && (
                <div className="relative">
                  <Input
                    type={showPassword[field.name] ? 'text' : 'password'}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className={cn('pr-10 h-12', getFieldClasses(field))}
                    disabled={field.disabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="absolute right-0 top-0 h-12 px-3 text-fg-tertiary hover:text-fg-primary"
                  >
                    {showPassword[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              )}
              {field.type === 'number' && (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name, { valueAsNumber: true })}
                  className={cn('h-12', getFieldClasses(field))}
                  disabled={field.disabled}
                />
              )}
              {field.type === 'file' && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      multiple={field.multiple}
                      accept="image/*"
                      capture="environment"
                      {...register(field.name)}
                      onChange={(e) => {
                        register(field.name).onChange(e);
                        handleFileUpload(field.name, e.target.files);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={field.disabled}
                    />
                    <div
                      className={cn(
                        'h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors',
                        'border-color-primary/30 hover:border-color-primary/50 bg-color-surface',
                        field.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <Upload className="h-6 w-6 text-color-primary" />
                      <p className="text-sm text-fg-secondary">
                        {field.placeholder || 'Click to upload or drag and drop'}
                      </p>
                    </div>
                  </div>

                  {uploadedFiles[field.name] && uploadedFiles[field.name].length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {uploadedFiles[field.name].map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="bg-color-surface-muted rounded-lg p-3 border border-fg-border">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-color-primary/10 rounded flex items-center justify-center">
                                <Upload className="h-4 w-4 text-color-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-fg-primary truncate">{file.name}</p>
                                <p className="text-xs text-fg-secondary">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(field.name, index)}
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-color-error hover:bg-color-error/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {field.type === 'multiselect' && field.options && (
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { value, onChange } }) => (
                    <div className="space-y-2">
                      <Multiselect
                        options={field.options?.map((item) => item.value)}
                        isObject={false}
                        showCheckbox={true}
                        hidePlaceholder={true}
                        closeOnSelect={false}
                        avoidHighlightFirstOption
                        onSelect={onChange}
                        onRemove={onChange}
                        placeholder={field.placeholder}
                        selectedValues={value}
                        className="bg-color-surface rounded-md border-fg-border"
                        disable={field.disabled}
                        style={{
                          chips: {
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '12px',
                            padding: '4px 8px',
                          },
                          searchBox: {
                            border: '1px solid var(--fg-border)',
                            borderRadius: '8px',
                            padding: '12px',
                            background: 'var(--color-surface)',
                            minHeight: '48px',
                          },
                          option: {
                            background: 'var(--color-surface)',
                            color: 'var(--fg-primary)',
                            padding: '8px 12px',
                            borderBottom: '1px solid var(--fg-border)',
                          },
                        }}
                      />
                      {Array.isArray(value) && value.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {value.map((item: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {field.options?.find((opt) => opt.value === item)?.label || item}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                />
              )}
              {field.type === 'phone' && (
                <InputPhone
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className={cn('h-12', getFieldClasses(field))}
                  onChange={(value) => {
                    setValue(field.name, value);
                  }}
                  value={watch(field.name) as string}
                  country={'in'}
                  disabled={field.disabled}
                />
              )}
              {field.type === ('textarea' as IFieldConfig['type']) && (
                <Textarea
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className={cn('min-h-[100px] resize-vertical', getFieldClasses(field))}
                  disabled={field.disabled}
                />
              )}

              {![
                'select',
                'radio',
                'checkbox',
                'password',
                'number',
                'file',
                'multiselect',
                'phone',
                'textarea',
              ].includes(field.type) && (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name, {
                    valueAsNumber: field.type === 'number',
                  })}
                  className={cn('h-12', getFieldClasses(field))}
                  disabled={field.disabled}
                />
              )}
              {renderErrorMessage(field.name)}

              {/* Add separator between fields except for the last one */}
              {index < config.length - 1 && <Separator className="bg-fg-border/30 my-4" />}
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || isLoading}
              className="flex-1 sm:flex-none h-12 border-fg-border hover:bg-color-surface-muted"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 h-12 bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{submitText}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default XForm;
