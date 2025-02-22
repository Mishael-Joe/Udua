import { Link, ShareIcon } from "lucide-react";

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

export default function ShareButton({ slug }: any) {
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
        {/* <Button
          size={"icon"}
          variant="default"
          className="bg-slate-100 text-udua-orange-primary hover:bg-white"
        >
          
        </Button> */}
        <ShareIcon
          className="bg-slate-100 text-udua-orange-primary hover:bg-white p-0.5 rounded"
          size={"icon"}
          width={25}
          height={25}
        />
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
