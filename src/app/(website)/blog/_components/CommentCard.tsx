"use client";
import Avatar from "@/components/datadisplay/Avatar";
import CommentsForm from "@/app/(website)/blog/_components/CommentsForm";
import CommentsList from "@/app/(website)/blog/_components/CommentsList";
import { dateConvert } from "@/utils/dateConvert";
import { Button } from "@heroui/button";
import { Reply, Pencil, X, Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import apiCRUD from "@/services/apiCRUD";
import Loader from "@/components/svg/Loader";
import { useDisclosure } from "@heroui/modal";
import { CommentIndex, CommentsIndexSite } from "@/types/apiTypes";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

type Props = {
  comment: CommentIndex | CommentsIndexSite["comments"][number];
  postOrProductSlug?: string;
  isReply?: boolean;
  type: "products" | "posts";
  replyDisable?: boolean;
  mutate?: () => void;
};
export default function CommentCard({
  comment,
  postOrProductSlug,
  isReply = false,
  type,
  replyDisable = false,
  mutate,
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [childComments, setChildComments] = useState<
    CommentsIndexSite["comments"] | CommentIndex[]
  >([]);
  const [showChilds, setShowChilds] = useState(false);
  const [moreBtnLoading, setMoreBtnLoading] = useState(false);
  const [buttonsLoading, setButtonsLoading] = useState(false);
  const [childsPage, setChildsPage] = useState(1);
  const [childsLastPage, setChildsLastPage] = useState(1);
  const [editForm, setEditForm] = useState(false);
  const [theComment, setTheComment] = useState(comment);
  const { onClose } = useDisclosure();
  useEffect(() => {
    setTheComment(comment);
  }, [comment]);

  const fetchChildComments = useCallback(
    async (loading: boolean = true, isMutateMode: boolean = false) => {
      if (loading) setMoreBtnLoading(true);
      const data = await apiCRUD({
        urlSuffix: `next/${type}/${postOrProductSlug}/comments?parent=${comment?.id}&page=${childsPage}`,
      });

      if (data?.status === "success") {
        if (isMutateMode && childsPage !== childsLastPage) return;
        if (isMutateMode) {
          setChildComments((prevComments) => {
            const newComments = (
              data.data?.comments as typeof childComments
            )?.filter(
              (newComment) =>
                !prevComments.some(
                  (prevComment) => prevComment.id === newComment.id,
                ),
            );
            return [...prevComments, ...newComments];
          });
        } else {
          setChildComments((prevComments) => [
            ...prevComments,
            ...data.data.comments,
          ]);
        }
        setChildsLastPage(data.data.meta.last_page);
      }
      setMoreBtnLoading(false);
    },
    [comment?.id, type, postOrProductSlug, childsPage, childsLastPage],
  );

  useEffect(() => {
    if (showChilds) fetchChildComments(true);
    else {
      setChildsPage(1);
      setChildsLastPage(1);
      setChildComments([]);
    }
  }, [fetchChildComments, showChilds]);

  const handleAction = async (type: "approve" | "reject" | "delete") => {
    setButtonsLoading(true);
    const data = await apiCRUD({
      urlSuffix: `admin-panel/comments/${comment?.id}`,
      method: "POST",
      data: {
        _method: type === "delete" ? "delete" : "put",
        ...(type !== "delete"
          ? { status: type === "approve" ? "approved" : "rejected" }
          : {}),
      },
      requiresToken: true,
    });
    if (data?.status === "success") {
      if (mutate) mutate();
      onClose();
    }
    setButtonsLoading(false);
  };

  return (
    <div className="flex gap-5 max-md:gap-1">
      <div className="max-md:hidden">
        <Avatar imgSrc={null} width={64} height={64} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="relative rounded-[16px] bg-boxBg300 p-[20px] max-md:flex-col max-md:p-[15px_20px_10px_20px]">
          <div className="flex flex-col gap-[2px] self-start md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div>
                  <Avatar
                    imgSrc={null}
                    styles={{ icon: { color: "var(--boxBg100)" } }}
                    width={30}
                    height={30}
                  />
                </div>
                <h4 className="text-TextSize400 font-[500]">
                  {theComment?.user?.name}
                </h4>
              </div>
              <p className="text-TextSize300 text-TextLow">
                {dateConvert(theComment?.created_at, "persian")}
              </p>
            </div>
          </div>
          <div>
            <div className="max-md:hidden">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-TextSize600 font-[500]">
                    {theComment?.user?.name}
                  </h4>
                </div>
                <p className="text-TextSize300 text-TextLow">
                  {dateConvert(theComment?.created_at, "persian")}
                </p>
              </div>
            </div>
            <p className="mt-3 md:ml-12">{theComment?.text}</p>
          </div>
          {/* confirm comment buttons */}
          <div className="absolute bottom-2 left-2 flex gap-1 max-md:top-2">
            <ProtectComponent
              permission="commentsEdit"
              component={
                <>
                  {theComment?.status !== "approved" && (
                    <Button
                      size="sm"
                      className="flex h-[28px] w-[28px] !min-w-0 items-center gap-1 px-0 py-0"
                      onPress={() => handleAction("approve")}
                      isIconOnly
                      isDisabled={buttonsLoading}
                    >
                      <Check className="w-4 text-TextLow" />
                    </Button>
                  )}
                  {theComment?.status !== "rejected" && (
                    <Button
                      size="sm"
                      className="flex h-[28px] w-[28px] !min-w-0 items-center gap-1 px-0 py-0"
                      onPress={() => handleAction("reject")}
                      isIconOnly
                      isDisabled={buttonsLoading}
                    >
                      <X className="w-4 text-TextLow" />
                    </Button>
                  )}
                  {/* there is no delete button at the moment */}
                  {/*  <Button
              size="sm"
              className="flex h-[28px] w-[28px] !min-w-0 items-center gap-1 px-0 py-0"
              onPress={onOpen}
              isIconOnly
              isDisabled={buttonsLoading}
            >
              <Trash2 className="w-4 text-TextLow" />
            </Button>
            <ConfirmModal
              size="sm"
              isOpen={isOpen}
              onClose={onClose}
              onOpenChange={onOpenChange}
              confirmText="آیا می‌خواهید این کامنت را حذف کنید؟"
              confirmAction={() => handleAction("delete")}
            /> */}
                  <Button
                    size="sm"
                    className="flex h-[28px] w-[28px] !min-w-0 items-center gap-1 px-0 py-0"
                    onPress={() => {
                      setEditForm((prev) => !prev);
                      setShowReplyForm(false);
                    }}
                    isIconOnly
                    isDisabled={buttonsLoading}
                  >
                    <Pencil className="w-4 text-TextLow" />
                  </Button>
                </>
              }
            />
          </div>
          {/*---------------- */}
        </div>
        <div className="mt-[5px] flex flex-wrap gap-2">
          {!isReply && !replyDisable && (
            <>
              <div className="pl-2">
                <Button
                  variant="light"
                  size="sm"
                  className="flex items-center gap-1 px-0"
                  onPress={() => {
                    setShowReplyForm((prev) => !prev);
                    setEditForm(false);
                  }}
                >
                  <Reply className="w-[12px] text-TextLow" />
                  <p className="text-TextSize300">پاسخ دادن</p>
                </Button>
              </div>
              {theComment?.childs_count?.toString() > "0" && (
                <div>
                  <Button
                    variant="light"
                    size="sm"
                    className="flex items-center gap-1 px-0"
                    onPress={() => {
                      setShowChilds((prev) => !prev);
                    }}
                  >
                    <Reply className="w-[12px] text-TextLow" />
                    <p className="text-TextSize300">
                      پاسخ ها ({theComment?.childs_count})
                    </p>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        {showReplyForm || editForm ? (
          <CommentsForm
            isReply={!editForm}
            type={type}
            comment_id={theComment.id}
            parentComment_id={isReply ? theComment?.id : undefined}
            editText={editForm ? theComment?.text : undefined}
            editCommentId={editForm ? theComment?.id : undefined}
            editedComment={(_, newText) => {
              if (editForm && theComment.parent_id !== 0) {
                setTheComment((prev) => ({ ...prev, text: newText }));
              }
            }}
            mutate={() => {
              if (editForm && comment.parent_id === 0) mutate?.();
              if (showReplyForm) {
                fetchChildComments(false, true);
              }
            }}
          />
        ) : null}
        {childComments && showChilds && (
          <div className="border-y-1 border-border">
            {childComments.length > 0 && (
              <CommentsList
                type={type}
                comments={childComments}
                isLoading={false}
                pagination={false}
                showForm={false}
                childsReplyDisable
                mutate={() => fetchChildComments(false)}
              />
            )}
            {moreBtnLoading && (
              <div className="flex h-[120px] w-full items-center justify-center">
                <div className="-mt-8">
                  <Loader />
                </div>
              </div>
            )}
            {childsPage < childsLastPage && (
              <div className="flex w-full items-center justify-center">
                <Button
                  variant="light"
                  size="sm"
                  className="-mt-10 flex items-center gap-1 px-0"
                  onPress={() => {
                    setChildsPage((prevPage) => prevPage + 1);
                  }}
                  isDisabled={moreBtnLoading}
                >
                  بارگذاری بیشتر
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
