"use client";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import Avatar from "@/components/datadisplay/Avatar";
import { Send } from "lucide-react";
import { Button } from "@heroui/button";
import useMyForm from "@/hooks/useMyForm";
import { toast } from "react-hot-toast";
import apiCRUD from "@/services/apiCRUD";

type Props = {
  postOrProductSlug?: string;
  type: "products" | "posts";
  parentComment_id?: number;
  comment_id?: number;
  isReply?: boolean;
  editText?: string;
  editCommentId?: number;
  mutate?: () => void;
  editedComment?: (id: number, text: string) => void;
};

export default function CommentsForm({
  postOrProductSlug,
  type,
  parentComment_id,
  comment_id,
  isReply,
  editText,
  editCommentId,
  editedComment,
  mutate,
}: Props) {
  const {
    values,
    errors,
    loading,
    setErrors,
    handleChange,
    handleSubmit,
    clearForm,
  } = useMyForm(
    {
      text: editText || "",
      parent_id: parentComment_id || undefined,
    },
    async (formdata) => {
      const data = await apiCRUD({
        urlSuffix: isReply
          ? `next/profile/comments/reply/${comment_id}`
          : editText
            ? `admin-panel/comments/${editCommentId}`
            : `next/${type === "products" ? "products" : "posts"}/${postOrProductSlug}/comment`,
        method: "POST",
        data: editText
          ? {
              ...formdata,
              _method: "put",
            }
          : formdata,
      });
      if (data.message) {
        setErrors(data.message);
        if (typeof data.message === "string") toast.error(data.message);
      }

      if (data.status === "success") {
        if (mutate) mutate();
        editedComment?.(data.data?.id, data.data?.text);
        clearForm();
      }
    },
    {
      text: [{ message: "متن پیام اجباری میباشد", required: true }],
    },
  );

  return (
    <div className="flex items-center gap-3 max-md:flex-col max-md:items-start">
      <div className="max-md:hidden">
        <Avatar imgSrc={null} width={64} height={64} />
      </div>
      <div className="md:hidden">
        <Avatar imgSrc={null} width={40} height={40} />
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        {editText && <p className="pb-2">ویرایش نظر: </p>}
        <div className="flex items-center rounded-[16px] bg-boxBg100">
          <div className="flex flex-1 items-center overflow-hidden rounded-[16px] border-1 border-border">
            <div className="flex-1">
              <TextAreaCustom
                name="comment"
                label=" "
                placeholder="دیدگاه خود را بنویسید..."
                type="text"
                value={values.text}
                onChange={handleChange("text")}
                classNames={{
                  inputWrapper:
                    "border-0 focus-within:outline-transparent !bg-transparent",
                }}
              />
            </div>
            <Button
              type="submit"
              isLoading={loading}
              variant="light"
              className="mx-1 h-full cursor-pointer p-3"
            >
              <Send className="text-TextLow" />
            </Button>
          </div>
        </div>
        {errors.text && (
          <p className="text-destructive-foreground">{errors.text}</p>
        )}
      </form>
    </div>
  );
}
