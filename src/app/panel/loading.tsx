import { Spinner } from "@heroui/spinner";

export default function Loading() {
  return (
    <div>
      <div className="grid h-[300px] place-self-center">
        <Spinner color="primary" />
      </div>
    </div>
  );
}
