import TableGenerate from "@/components/datadisplay/TableGenerate";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import apiCRUD from "@/services/apiCRUD";
import useSWR from "swr";
import { TransactionsSite } from "@/types/apiTypes";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { dateConvert } from "@/utils/dateConvert";
import { currency } from "@/constants/staticValues";

export default function PaymentsTab() {
  const { filters, changeFilters, deleteFilter } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `next/profile/transactions${filters ? "?" + filters.replace(/&?tab=[^&]*/g, "") : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const transactions: TransactionsSite = data?.data;

  return (
    <div className="w-full px-3 pb-12">
      <div className="mb-5 inline-block">
        <SelectSearchCustom
          placeholder="همه پرداخت ها"
          isSearchDisable
          options={[
            {
              id: "success",
              title: "موفق",
            },
            {
              id: "rejected",
              title: "ناموفق",
            },
            {
              id: "pending",
              title: "در انتظار",
            },
          ]}
          onChange={(selectedOption) => {
            if (selectedOption?.[0]?.id)
              changeFilters("status=" + selectedOption[0].id);
            else deleteFilter("status");
          }}
        />
      </div>

      <TableGenerate
        stripedRows
        pagination={{
          page: transactions?.meta.current_page,
          total: transactions?.meta.last_page,
        }}
        onPageChange={(page) => {
          changeFilters(`page=${page}`);
        }}
        loading={isLoading ? { columns: 6, rows: 5 } : undefined}
        error={error}
        onRetry={() => mutate()}
        data={{
          headers: [
            { content: "شماره سفارش" },
            { content: "ایجاد" },
            { content: "آپدیت" },
            { content: "درگاه" },
            { content: "مبلغ" },
            { content: "وضعیت پرداخت" },
          ],
          body: transactions?.transactions.map((transaction) => ({
            cells: [
              { data: transaction.order_id },
              { data: dateConvert(transaction.created_at, "persian") },
              { data: dateConvert(transaction.updated_at, "persian") },
              { data: `${transaction.gateway_name}` },
              { data: transaction.amount.toLocaleString() + " " + currency },
              {
                data: (
                  <p
                    className={
                      transaction.status === "success"
                        ? "text-successForeground"
                        : transaction.status === "failed"
                          ? "text-failureForeground"
                          : "text-pendingForeground"
                    }
                  >
                    {transaction.status === "success"
                      ? "موفق"
                      : transaction.status === "rejected"
                        ? "ناموفق"
                        : transaction.status === "pending"
                          ? "در انتظار"
                          : "نا مشخص"}
                  </p>
                ),
              },
            ],
          })),
        }}
      />
    </div>
  );
}
