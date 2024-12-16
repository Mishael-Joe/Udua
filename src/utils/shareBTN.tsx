import { Link, ShareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Image from "next/image";

export default function ShareButton({ slug }: any) {
  const { toast } = useToast();

  const productTitle = "Check out this amazing product!";
  const productUrl = slug;

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
        <Button
          size={"icon"}
          variant="default"
          className="bg-slate-100 text-udua-orange-primary hover:bg-white"
        >
          <ShareIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className=" text-center font-semibold">Share to</p>
        <div className=" flex gap-2 justify-evenly w-full pt-4 items-center">
          <EmailShareButton url={productUrl} title={productTitle}>
            <EmailIcon size={32} round />
          </EmailShareButton>

          <FacebookShareButton url={productUrl} title={productTitle}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton url={productUrl} title={productTitle}>
            <Image src={"/twitter-x.svg"} height={50} width={50} alt={"twitter icon"}/>
          </TwitterShareButton>

          <WhatsappShareButton url={productUrl} title={productTitle}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <Link size={32} onClick={() => copyToClipboardAsync(slug)} className=" rounded-full border p-1"/>
        </div>
      </PopoverContent>
    </Popover>
  );
}
