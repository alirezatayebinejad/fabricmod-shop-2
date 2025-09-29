import React, { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

type Rule = {
  message: string;
  required?: boolean;
  pattern?: RegExp;
  validateOnChange?: boolean;
};

type Rules<T> = {
  [K in keyof T]?: Rule[];
};

const validateField = (value: string, rules?: Rule[]): string => {
  if (!rules) return "";
  for (const rule of rules) {
    if (rule.required && !value) {
      return rule.message || "این فیلد نمیتواند خالی باشد";
    }
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
      return rule.message || "فرمت ورودی اشتباه است";
    }
  }
  return "";
};

const useMyForm = <T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  rules: Rules<T> = {},
) => {
  type ValuesType = typeof initialValues;

  const [values, setValues] = useState<ValuesType>(initialValues);
  const [errors, setErrors] = useState<Record<keyof ValuesType, string>>(
    Object.keys(initialValues).reduce(
      (acc, key) => {
        acc[key as keyof ValuesType] = "";
        return acc;
      },
      {} as Record<keyof ValuesType, string>,
    ),
  );
  const [loading, setLoading] = useState<boolean>(false);
  /* if initialvalues changed and is not equal to the previous initialvalues, update it - cause in some rare usecases it may causes rerenders */
  const prevInitialValues = useRef(initialValues);
  useEffect(() => {
    if (
      JSON.stringify(prevInitialValues.current) !==
      JSON.stringify(initialValues)
    ) {
      setValues(initialValues);
      prevInitialValues.current = initialValues;
    }
  }, [initialValues]);
  console.log(values);
  const handleChange = useCallback(
    (name: keyof ValuesType) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string) => {
        const value =
          typeof e === "undefined"
            ? undefined
            : typeof e === "string"
              ? e
              : e.target?.value;
        //typeof string is when we send the value directly not by inputs events
        setValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
        if (rules[name] && rules[name]?.some((rule) => rule.validateOnChange)) {
          const error = validateField(value || "", rules[name]);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
          }));
        }
      },
    [rules],
  );

  const validateForm = useCallback((): boolean => {
    let valid = true;
    const newErrors = { ...errors };
    for (const field in rules) {
      const value = values[field];
      const error = validateField(value, rules[field]);
      if (error) {
        newErrors[field as keyof ValuesType] = error;
        valid = false;
      } else {
        newErrors[field as keyof ValuesType] = "";
      }
    }
    setErrors(newErrors);
    return valid;
  }, [errors, rules, values]);

  const formdata = useCallback((): ValuesType => {
    return { ...values };
  }, [values]);

  const clearForm = () => {
    setValues(initialValues);
    setErrors(
      Object.keys(initialValues).reduce(
        (acc, key) => {
          acc[key as keyof ValuesType] = "";
          return acc;
        },
        {} as Record<keyof ValuesType, string>,
      ),
    );
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateForm()) {
        toast.error("اطلاعات را به درستی وارد کنید");
        return;
      }
      //reset previous submit errors
      setErrors(
        Object.keys(initialValues).reduce(
          (acc, key) => {
            acc[key as keyof ValuesType] = "";
            return acc;
          },
          {} as Record<keyof ValuesType, string>,
        ),
      );
      setLoading(true);
      const formValues = formdata();
      await onSubmit(formValues);
      setLoading(false);
    },
    [onSubmit, validateForm, formdata, initialValues],
  );

  const setFieldError = (name: keyof ValuesType, errorMessage: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
    clearForm,
    setFieldError,
  };
};

export default useMyForm;
