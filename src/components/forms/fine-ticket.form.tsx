import { FC, useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/errors/error-message";
import { TFineTicketFormValues, fineTicketFormSchema } from "@/schemas/fine-ticket-form.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FINE_TICKET_PAYMENT_METHOD, FINE_TICKET_STATUS } from "@/constants/fine-ticket.enum";

type Props = {
  onSubmit: (values: TFineTicketFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<TFineTicketFormValues>;
  submitButtonText: string;
  isLoading?: boolean;
};

export const FineTicketForm: FC<Props> = ({ onSubmit, onCancel, defaultValues = {}, submitButtonText, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TFineTicketFormValues>({
    resolver: zodResolver(fineTicketFormSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof TFineTicketFormValues, value);
        }
      });
    }
  }, [defaultValues, setValue]);

  const onValidSubmit = async (values: TFineTicketFormValues): Promise<void> => {
    await onSubmit(values);
  };

  const onInvalidSubmit = (errors: FieldErrors<TFineTicketFormValues>): void => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} className="grid grid-cols-2 gap-x-12 gap-y-6 p-10">
      <div className="col-span-1">
        <Label htmlFor="total_fine_amount">Tổng tiền phạt</Label>
        <Input id="total_fine_amount" type="number" {...register("total_fine_amount", { valueAsNumber: true })} placeholder="Nhập tổng tiền phạt" disabled={isLoading} />
        <ErrorMessage message={errors.total_fine_amount?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="payment_date">Ngày thanh toán</Label>
        <Input id="payment_date" type="date" {...register("payment_date")} placeholder="Chọn ngày thanh toán" disabled={isLoading} />
        <ErrorMessage message={errors.payment_date?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="status">Trạng thái</Label>
        <Select onValueChange={(value) => setValue("status", value as FINE_TICKET_STATUS)} defaultValue={defaultValues.status}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FINE_TICKET_STATUS).map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ErrorMessage message={errors.status?.message} />
      </div>

      <div className="col-span-1">
        <Label htmlFor="payment_method">Phương thức thanh toán</Label>
        <Select onValueChange={(value) => setValue("payment_method", value as FINE_TICKET_PAYMENT_METHOD)} defaultValue={defaultValues.payment_method}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn phương thức thanh toán" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FINE_TICKET_PAYMENT_METHOD).map((method) => (
              <SelectItem key={method} value={method}>{method}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ErrorMessage message={errors.payment_method?.message} />
      </div>

      <div className="col-span-2 flex justify-between">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
};
