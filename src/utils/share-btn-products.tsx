import { Link, Share2, ShareIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useToast } from "@/components/ui/use-toast";

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ShareButtonForProducts({ slug }: any) {
  const { toast } = useToast();

  let title: string;
  const productUrl = slug;

  if (slug.includes("brand")) {
    title = "Check out this brand on Udua";
  } else if (slug.includes("store")) {
    title = "Check out my brand on Udua";
  } else {
    title = "Check out this amazing product!";
  }
  // console.log('slug', slug)
  // console.log('title', title)

  async function copyToClipboardAsync(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `Text copied to clipboard`,
      });
      // console.log('Text copied to clipboard');
    } catch (err) {
      console.error("Unable to copy text to clipboard", err);
    }
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" size="lg" className="w-full sm:w-aut">
          <Share2 className="mr-2 h-4 w-4" />
          <span className="sm:hidde md:inline">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className=" text-center font-semibold">Share to</p>
        <div className=" flex gap-2 justify-evenly w-full pt-4 items-center">
          <EmailShareButton url={productUrl} title={title}>
            <EmailIcon size={32} round />
          </EmailShareButton>

          <FacebookShareButton url={productUrl} title={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton url={productUrl} title={title}>
            <Image
              src={"/twitter-x.svg"}
              height={50}
              width={50}
              alt={"twitter icon"}
            />
          </TwitterShareButton>

          <WhatsappShareButton url={productUrl} title={title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <Link
            size={32}
            onClick={() => copyToClipboardAsync(slug)}
            className=" rounded-full border p-1"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
