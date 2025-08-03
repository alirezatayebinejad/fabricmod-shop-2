"use client";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import InputBasic from "@/components/inputs/InputBasic";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import { useDisclosure } from "@heroui/modal";
import apiCRUD from "@/services/apiCRUD";
import { Faq, ProductShow } from "@/types/apiTypes";
import { Spinner } from "@heroui/spinner";
import useSWR from "swr";
import RetryError from "@/components/datadisplay/RetryError";
import { Check, Plus, X } from "lucide-react";

type FaqsProps = {
  type: "post" | "product" | "category";
  id?: number;
  mode: "edit" | "show" | "create";
  withButton: boolean; //show a button when clicked and faqsList is not available it will fetch data
  faqsList?: Faq[] | ProductShow["faqs"];
  onFaqsChange?: (faqs: Faq[] | undefined) => void;
  onSaveStatusChange?: (hasUnsavedChanges: boolean) => void; //return true if we have unsaved changes
};

export default function Faqs({
  type,
  id,
  mode,
  onFaqsChange,
  onSaveStatusChange,
  withButton = false,
  faqsList,
}: FaqsProps) {
  const [runModule, setRunMudule] = useState(!withButton || mode === "create");

  const { data, error, isLoading, mutate } = useSWR(
    !faqsList &&
      mode !== "create" &&
      runModule &&
      `admin-panel/faqs?type=${type}&id=${id}`,
    (url: string) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const deleteFaqConfirm = useDisclosure();
  const [faqs, setFaqs] = useState<(Faq & { isEdited: boolean })[] | undefined>(
    undefined,
  );
  const [newFaqsEdit, setNewFaqsEdit] = useState<
    { id: number; subject: string; body: string }[] | undefined
  >(undefined);
  const [savingFaqId, setSavingFaqId] = useState<number | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<
    (Faq & { isEdited: boolean }) | null
  >(null);
  const [deletingFaqId, setDeletingFaqId] = useState<number | null>(null);
  const [savingNewFaqs, setSavingNewFaqs] = useState(false);
  const [errors, setErrors] = useState<any>(undefined);

  useEffect(() => {
    if (data || faqsList) {
      setFaqs(faqsList?.map((f) => ({ ...f, isEdited: false })) || data.data);
    }
  }, [data, faqsList]);

  useEffect(() => {
    // Notify parent about unsaved changes
    if (onSaveStatusChange && mode !== "create") {
      const hasUnsavedChanges =
        faqs?.some((faq) => faq.isEdited) || (newFaqsEdit?.length ?? 0) > 0;
      onSaveStatusChange(hasUnsavedChanges);
    }
  }, [faqs, newFaqsEdit, onSaveStatusChange, mode]);

  const updateFaqs = (
    updatedFaqs: (Faq & { isEdited: boolean })[] | undefined,
  ) => {
    setFaqs(updatedFaqs);
    onFaqsChange?.(updatedFaqs);
  };

  const handleAddFaq = () => {
    if (mode === "edit") {
      setNewFaqsEdit((prev) => [
        ...(prev || []),
        { id: Date.now(), subject: "", body: "" },
      ]);
    } else {
      const newFaqs = [
        ...(faqs || []),
        { id: Date.now(), subject: "", body: "", isEdited: false } as Faq & {
          isEdited: boolean;
        },
      ];
      updateFaqs(newFaqs);
    }
  };

  const handleFaqChange = (
    index: number,
    field: keyof { subject: string; body: string },
    value: string,
  ) => {
    const newFaqs = [...(faqs || [])];
    newFaqs[index][field] = value;
    newFaqs[index]["isEdited"] = true;
    updateFaqs(newFaqs);
  };

  const handleNewFaqEditChange = (
    index: number,
    field: keyof { subject: string; body: string },
    value: string,
  ) => {
    const newFaqs = [...(newFaqsEdit || [])];
    newFaqs[index][field] = value;
    setNewFaqsEdit(newFaqs);
  };

  const handleSaveFaq = async (faq: Faq & { isEdited: boolean }) => {
    setErrors(undefined);
    setSavingFaqId(faq.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/faqs/${faq.id}`,
      method: "POST",
      updateCacheByTag: "initials",
      data: {
        subject: faq.subject,
        body: faq.body,
        _method: "put",
      },
    });
    if (res?.status === "success") {
      const updatedFaqs = faqs?.map((f) => {
        if (f.id === faq.id) {
          return { ...faq, isEdited: false };
        } else return f;
      });
      updateFaqs(updatedFaqs);
    } else {
      setErrors((prev: any) => ({
        ...prev,
        [`save.${faq.id}`]: res?.message,
      }));
    }
    setSavingFaqId(null);
  };

  const handleSaveNewFaqsEdit = async () => {
    setErrors(undefined);
    setSavingNewFaqs(true);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/faqs`,
      method: "POST",
      updateCacheByTag: "initials",
      data: {
        faqs: newFaqsEdit,
        type: type,
        id: id,
      },
    });
    if (res?.status === "success") {
      const updatedFaqs = [...(faqs || []), ...res.data?.map((f: Faq) => f)];
      updateFaqs(updatedFaqs);
      setNewFaqsEdit(undefined);
    } else {
      setErrors(res?.message);
    }
    setSavingNewFaqs(false);
  };

  const handleDeleteFaq = async (faqId: number, localMode: boolean) => {
    setDeletingFaqId(faqId);
    if (localMode) {
      const updatedFaqs = faqs?.filter((faq) => faq.id !== faqId);
      updateFaqs(updatedFaqs);
    } else {
      const res = await apiCRUD({
        urlSuffix: `admin-panel/faqs/${faqId}`,
        method: "POST",
        updateCacheByTag: "initials",
        data: {
          _method: "delete",
        },
      });
      if (res?.status === "success") {
        const updatedFaqs = faqs?.filter((faq) => faq.id !== faqId);
        updateFaqs(updatedFaqs);
      } else {
        setErrors((prev: any) => ({
          ...prev,
          [`delete.${faqId}`]: res?.message,
        }));
      }
    }
    setDeletingFaqId(null);
  };

  const handleDeleteNewFaqEdit = async (faqId: number) => {
    setNewFaqsEdit((prev) => prev?.filter((f) => f.id !== faqId));
  };

  if (isLoading) {
    return (
      <div className="grid h-[200px] w-full place-content-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-[250px]">
        <RetryError
          onRetry={() => {
            mutate();
          }}
        />
      </div>
    );
  }
  if (!runModule)
    return (
      <div>
        <Button
          type="button"
          className="mt-2"
          onPress={() => setRunMudule(true)}
        >
          {mode === "edit"
            ? "مشاهده و ویرایش سوالات متداول"
            : "مشاهده سوالات متداول"}
        </Button>
      </div>
    );
  return (
    <div>
      <h3 className="my-2">سوالات متداول:</h3>
      {!faqs?.length && !newFaqsEdit?.length && (
        <p className="text-center">بدون سوال</p>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {faqs?.map((faq, index) => (
          <div
            key={index}
            className="relative mt-3 flex flex-col gap-2 rounded-[8px] border-1 border-border p-3 pt-7"
          >
            <InputBasic
              name={`faq_subject_${index + "/" + faq.subject}`}
              label={"سوال " + (index + 1)}
              value={faq.subject}
              onChange={(e) =>
                handleFaqChange(index, "subject", e.target.value)
              }
              isDisabled={mode === "show"}
            />
            {mode === "create" && errors?.[`faqs.${index}.subject`] && (
              <p className="text-destructive-foreground">
                {errors?.[`faqs.${index}.subject`]}
              </p>
            )}
            {mode === "edit" && errors?.[`save.${faq.id}`] && (
              <p className="text-destructive-foreground">
                {errors?.[`save.${faq.id}`].subject}
              </p>
            )}
            <InputBasic
              name={`faq_body_${index + "/" + faq.subject}}`}
              label={"جواب"}
              value={faq.body}
              onChange={(e) => handleFaqChange(index, "body", e.target.value)}
              isDisabled={mode === "show"}
              classNames={{ container: "mt-3" }}
            />
            {mode === "create" && errors?.[`faqs.${index}.body`] && (
              <p className="text-destructive-foreground">
                {errors?.[`faqs.${index}.body`]}
              </p>
            )}
            {mode === "edit" && errors?.[`save.${faq.id}`] && (
              <p className="text-destructive-foreground">
                {errors?.[`save.${faq.id}`].body}
              </p>
            )}
            {errors?.[`delete.${faq.id}`] && (
              <p className="text-destructive-foreground">
                {errors?.[`delete.${faq.id}`]}
              </p>
            )}
            {mode === "edit" && (
              <div className="flex gap-3">
                {faq.isEdited && (
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2"
                    onPress={() => handleSaveFaq(faq)}
                    isLoading={savingFaqId === faq.id}
                  >
                    ذخیره تغییرات
                  </Button>
                )}
              </div>
            )}
            {mode !== "show" && (
              <>
                <Button
                  type="button"
                  className="absolute left-3 top-0 mt-2 bg-destructive"
                  size="sm"
                  isIconOnly
                  onPress={() => {
                    setSelectedFaq(faq);
                    deleteFaqConfirm.onOpen();
                  }}
                  isLoading={deletingFaqId === faq.id}
                >
                  <X className="w-4 text-destructive-foreground" />
                </Button>
              </>
            )}
          </div>
        ))}
        <ConfirmModal
          size="sm"
          isOpen={deleteFaqConfirm.isOpen}
          onClose={deleteFaqConfirm.onClose}
          onOpenChange={deleteFaqConfirm.onOpenChange}
          confirmText="آیا می‌خواهید این سوالات متداول را حذف کنید؟"
          confirmAction={() =>
            selectedFaq
              ? mode === "edit"
                ? handleDeleteFaq(selectedFaq?.id, false)
                : handleDeleteFaq(selectedFaq?.id, true)
              : undefined
          }
        />
        {newFaqsEdit?.map((faq, index) => (
          <div
            key={index}
            className="relative mt-3 flex flex-col gap-2 rounded-[8px] border-1 border-border p-3 pt-7"
          >
            <InputBasic
              name={`new_faq_subject_${index + "/" + faq.subject}`}
              label={"سوال جدید " + (index + 1)}
              value={faq.subject}
              onChange={(e) =>
                handleNewFaqEditChange(index, "subject", e.target.value)
              }
              isDisabled={mode === "show"}
            />
            {errors?.[`faqs.${index}.subject`] && (
              <p className="text-destructive-foreground">
                {errors?.[`faqs.${index}.subject`]}
              </p>
            )}
            <InputBasic
              name={`faq_body_${index + "/" + faq.subject}}`}
              label={"جواب"}
              value={faq.body}
              onChange={(e) =>
                handleNewFaqEditChange(index, "body", e.target.value)
              }
              isDisabled={mode === "show"}
              classNames={{ container: "mt-3" }}
            />
            {errors?.[`faqs.${index}.body`] && (
              <p className="text-destructive-foreground">
                {errors?.[`faqs.${index}.body`]}
              </p>
            )}
            <div>
              <Button
                type="button"
                className="absolute left-3 top-0 mt-2 bg-destructive"
                size="sm"
                isIconOnly
                onPress={() => handleDeleteNewFaqEdit(faq.id)}
              >
                <X className="w-4 text-destructive-foreground" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          {mode === "edit" && newFaqsEdit && (
            <Button
              type="button"
              className="mt-2 bg-accent-4"
              onPress={handleSaveNewFaqsEdit}
              startContent={<Check className="w-4" />}
              isLoading={savingNewFaqs}
            >
              ذخیره سوالات جدید
            </Button>
          )}
        </div>
      </div>
      {(mode === "create" || mode === "edit") && (
        <Button
          type="button"
          className="mt-2 bg-accent-2 text-accent-2-foreground"
          onPress={handleAddFaq}
          startContent={<Plus className="w-4" />}
        >
          افزودن سوال
        </Button>
      )}
    </div>
  );
}
