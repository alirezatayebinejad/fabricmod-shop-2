import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { Spinner } from "@heroui/spinner";
import { Address } from "@/types/apiTypes";
import RetryError from "@/components/datadisplay/RetryError";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import MapCustom from "@/components/inputs/MapCustom";
import { useState } from "react";
import { Button } from "@heroui/button";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import { X } from "lucide-react";
import AddressForm from "@/app/(website)/dashboard/_components/Tabs/AddressForm";

export default function AddressTab() {
  const { data, error, isLoading, mutate } = useSWR(
    `next/profile/addresses`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const addresses: Address[] = data?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(
    undefined,
  );

  const handleDelete = async () => {
    if (deleteId !== null) {
      const response = await apiCRUD({
        urlSuffix: `next/profile/addresses/${deleteId}`,
        method: "POST",
        data: { _method: "delete" },
      });
      if (response?.status === "success") {
        mutate();
      }
      setDeleteId(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsFormModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="grid h-[300px] place-self-center">
        <Spinner color="primary" />
      </div>
    );
  if (error) {
    return (
      <div className="h-[250px]">
        <RetryError onRetry={() => mutate()} />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <Button
        onPress={() => setIsFormModalOpen(true)}
        color="secondary"
        className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
      >
        افزودن آدرس جدید
      </Button>
      {addresses?.map((address) => (
        <div
          key={address.id}
          className="relative rounded-lg border-2 border-border bg-boxBg200 p-4"
        >
          <div className="absolute left-2 top-2 flex items-center gap-2">
            <Button
              variant="solid"
              className="gap-1 bg-destructive text-destructive-foreground"
              size="sm"
              startContent={<X className="w-4" />}
              onClick={() => {
                setDeleteId(address.id);
                setIsConfirmModalOpen(true);
              }}
            >
              حذف
            </Button>
            <Button
              variant="solid"
              className="gap-1 bg-primary text-primary-foreground"
              size="sm"
              onClick={() => handleEdit(address)}
            >
              ویرایش
            </Button>
          </div>
          <h3 className="text-lg font-semibold">{address.title}</h3>
          <p className="text-TextLow">گیرنده: {address.receiver_name}</p>
          <p className="text-TextLow">شماره تماس: {address.cellphone}</p>
          <p className="text-TextLow">آدرس: {address.address}</p>
          <p className="text-TextLow">کد پستی: {address.postal_code}</p>
          {address.latitude && address.longitude && (
            <Button
              variant="solid"
              className="mt-2"
              size="sm"
              onClick={() => {
                setSelectedLocation({
                  lat: parseFloat(address.latitude || "0"),
                  long: parseFloat(address.longitude || "0"),
                });
                setIsModalOpen(true);
              }}
            >
              نمایش نقشه
            </Button>
          )}
        </div>
      ))}
      {selectedLocation && (
        <ModalWrapper
          modalBody={
            <>
              <MapCustom
                markerData={[
                  {
                    lat: selectedLocation.lat,
                    long: selectedLocation.long,
                  },
                ]}
              />
              <div className="mb-3 mt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
                  variant="light"
                  onPress={() => setIsModalOpen(false)}
                >
                  {"بستن"}
                </Button>
              </div>
            </>
          }
          isDismissable={true}
          disclosures={{
            isOpen: isModalOpen,
            onOpenChange: () => setIsModalOpen(false),
          }}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onOpenChange={() => setIsConfirmModalOpen(false)}
        confirmText="آیا از حذف این آدرس اطمینان دارید؟"
        confirmAction={handleDelete}
        size="sm"
        onClose={() => setIsConfirmModalOpen(false)}
      />
      <ModalWrapper
        disclosures={{
          isOpen: isFormModalOpen,
          onOpenChange: () => {
            setIsFormModalOpen(false);
            setSelectedAddress(undefined);
          },
        }}
        size="5xl"
        modalHeader={
          <h2>{selectedAddress ? "ویرایش آدرس" : "افزودن آدرس جدید"}</h2>
        }
        isDismissable={true}
        modalBody={
          <AddressForm
            onClose={() => setIsFormModalOpen(false)}
            selectedData={selectedAddress}
            isEditMode={selectedAddress ? true : false}
          />
        }
      />
    </div>
  );
}
