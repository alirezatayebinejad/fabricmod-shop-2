import { Address } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import RetryError from "@/components/datadisplay/RetryError";
import AddressForm from "@/app/(website)/dashboard/_components/Tabs/AddressForm";

interface AddressSelectionOverlayProps {
  addresses: Address[];
  addressLoading: boolean;
  addressError: any;
  addressMutate: () => void;
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
  onConfirm: () => void;
  setCreatedAddressId: (id: number) => void;
  addressMutateCallback: () => void;
}

export default function AddressSelectionOverlay({
  addresses,
  addressLoading,
  addressError,
  addressMutate,
  selectedAddressId,
  onSelectAddress,
  onConfirm,
  setCreatedAddressId,
  addressMutateCallback,
}: AddressSelectionOverlayProps) {
  return (
    <main className="relative">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl overflow-y-auto rounded-lg border-1 p-6">
          <h2 className="mb-6 text-xl font-bold">انتخاب آدرس ارسال</h2>

          {addressLoading ? (
            <div className="grid h-[200px] w-full place-content-center">
              <Spinner />
            </div>
          ) : addressError ? (
            <div className="h-[250px]">
              <RetryError onRetry={addressMutate} />
            </div>
          ) : addresses && addresses.length > 0 ? (
            <div className="space-y-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={() => onSelectAddress(address.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-TextColor/70 mb-4">
                شما هنوز آدرسی ثبت نکرده‌اید
              </p>
            </div>
          )}
          <h2 className="my-6 text-xl font-bold">آدرس جدید</h2>
          <div className="rounded-lg border-1 bg-boxBg200 p-2">
            <AddressForm
              isEditMode={false}
              isInModal={false}
              confirmText="افزودن آدرس"
              onSuccess={(addressId) => {
                addressMutateCallback();
                setCreatedAddressId(addressId);
                onSelectAddress(addressId);
                onConfirm();
              }}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 bg-primary text-primary-foreground"
              onPress={onConfirm}
              isDisabled={!selectedAddressId}
            >
              تایید و ادامه
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
}

function AddressCard({ address, isSelected, onSelect }: AddressCardProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border-1 bg-boxBg250 p-2 transition-all ${
        isSelected
          ? "bg-primary/5 border-primary"
          : "hover:border-primary/50 border-border"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 font-semibold">{address.address}</p>
          <p className="text-TextColor/70 text-sm">
            گیرنده: {address.receiver_name}
          </p>
          <p className="text-TextColor/70 text-sm">تلفن: {address.cellphone}</p>
          {address.postal_code && (
            <p className="text-TextColor/70 text-sm">
              کد پستی: {address.postal_code}
            </p>
          )}
        </div>
        <div
          className={`h-6 w-6 rounded-full border-2 ${
            isSelected ? "border-primary bg-primary" : "border-border"
          }`}
        >
          {isSelected && (
            <svg
              className="h-full w-full text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
