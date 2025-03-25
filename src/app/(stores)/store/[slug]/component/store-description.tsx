"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditIcon, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Store } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { quillFormats, quillModules } from "@/constant/constant";
import DOMPurify from "dompurify";

interface StoreDescriptionProps {
  store: Store | null;
  loading?: boolean;
}

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

/**
 * StoreDescription component displays and manages store information
 * @component
 * @param {Store} store - Store data object
 * @param {boolean} [loading] - Loading state flag
 */
export default function StoreDescription({
  store,
  loading,
}: StoreDescriptionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storeDescription, setStoreDescription] = useState({
    updatedDescription: store?.description || "",
  });
  const [error, setError] = useState<string | null>(null);

  // Sync local state with store prop changes
  useEffect(() => {
    setStoreDescription({ updatedDescription: store?.description || "" });
  }, [store?.description]);

  /**
   * Handles textarea changes for store description
   * @param {ChangeEvent<HTMLTextAreaElement>} e - Textarea change event
   */
  const handleChange = (text: string) => {
    setStoreDescription((prev) => ({ ...prev, updatedDescription: text }));
    console.log(
      "storeDescription.updatedDescription",
      storeDescription.updatedDescription
    );
  };

  /**
   * Handles form submission for updating store description
   * @param {React.FormEvent} e - Form submission event
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (storeDescription.updatedDescription.length > 5000) {
      setError("Describe your store to customers in 5000 characters or less.");
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/store/update-store-description",
        storeDescription
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Store description updated successfully.",
        });
        setOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "There was an error updating your store description.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !store) {
    return (
      <Card className="relative">
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </CardContent>
        <CardFooter className="flex flex-col gap-3 items-start">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardFooter>
      </Card>
    );
  }

  const sanitizedContentForDescription = DOMPurify.sanitize(store.description);

  return (
    <Card className="relative group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {store?.name}
              <Badge variant="outline" className="text-sm">
                {store?.uniqueId}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              Store Information & Description
            </CardDescription>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Edit store description"
              >
                <EditIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Store Description</DialogTitle>
                <DialogDescription>
                  Describe your store to customers (max 5000 characters)
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-2">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex justify-between items-center">
                    <Label htmlFor="updatedDescription">Description</Label>
                    <span className="text-sm text-muted-foreground">
                      {storeDescription.updatedDescription.length}/5000
                    </span>
                  </div>
                  <QuillEditor
                    id="updatedDescription"
                    value={storeDescription.updatedDescription}
                    onChange={handleChange}
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-fit bg-inherit overflow-x-auto"
                    aria-label="Describe your store..."
                    aria-required="true"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose dark:prose-invert">
          {store?.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizedContentForDescription,
              }}
            ></div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>No store description provided</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 items-start border-t pt-4">
        <HoverCard>
          <HoverCardTrigger className="flex items-center gap-2 text-sm cursor-help">
            <Info className="w-4 h-4" />
            <span className="font-medium">Store Details</span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm">
                This information is visible to your customers on the store page.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Store ID</span>
            <span className="font-mono text-sm">{store?.uniqueId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Established</span>
            <span className="text-sm">
              {store?.createdAt &&
                format(new Date(store.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
